
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//проверка токена
export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Токен не предоставлен' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: string };
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('Ошибка аутентификации:', err);
    res.status(401).json({ error: 'Неверный токен' });
    return;
  }
};