import { Router, Request, Response, NextFunction } from 'express';
import { Middleware } from '../middleware/auth'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database';

const router = Router();

//регистрация
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password} = req.body;
  try {
    //проверка на уникальность email
    const userExists = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ error: 'Email уже зарегистрирован' });
    }
    //хеширование пароля 
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //добавление пользователя
    const newUser = await pool.query(
      'INSERT INTO Users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, "user"]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

//вход
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    //проверка на существование пользователя
    const user = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      res.status(401).json({ error: 'Неверный email или пароль' });
    }

    //проверка на корректность пароля
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      res.status(401).json({ error: 'Неверный email или пароль' });
    }

    //генерирование jwt-токена
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

//получение данных о текущем пользователе 
router.get('/me', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    //проверка на авторизацию
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Пользователь не аутентифицирован' });
      return;
    }

    //получение данных о пользователе
    const user = await pool.query('SELECT id, name, email, role FROM Users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) {
      res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Ошибка сервера'});
  }
});

//обновление данных о пользователе
router.patch('/me', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  const {email, name} = req.body;
  try {
    //проверка на авторизацию
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: 'Пользователь не аутентифицирован' });
      return;
    }

    //частичное или полное обновления данных о пользователе
    const userEdit = await pool.query(
      `UPDATE Users SET email = COALESCE($1, email), name = COALESCE($2, name)
       WHERE id = $3
       RETURNING email, name, id`,
      [email, name, req.user.id]
    );

    if (userEdit.rows.length === 0) {
      res.status(404).json({ error: 'Not updated' });
    }
    res.json(userEdit.rows[0]);
  } catch (err) {
    console.error('Error editing user:', err);
    res.status(500).json({ error: 'Ошибка сервера'});
  }
});

export default router;