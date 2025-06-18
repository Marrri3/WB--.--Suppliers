import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import shipmentsRoutes from './routes/shipment';
import pool from './database';
import 'dotenv/config';
import cron from 'node-cron'; 

const app = express();

app.use(cors());
app.use(express.json());

//тестовый маршрут для проверки подключения
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({ message: 'Database connected', time: result.rows[0] });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', shipmentsRoutes);

//проверка стауса поставки
const executeUpdateStatus = async () => {
  try {
    const result = await pool.query('SELECT UpdateStatus()');
    console.log('UpdateStatus executed successfully at', new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }), 'Result:', result.rows);
  } catch (err) {
    console.error('Error executing UpdateStatus:', err);
  }
};

//запуск executeUpdateStatus раз в день в 00:00
cron.schedule('0 0 * * *', () => {
  console.log(`Running UpdateStatus at ${new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' })}`);
  executeUpdateStatus();
}, {
  timezone: 'Europe/Moscow' 
});

//выполнение при старте сервера для тестирования
app.listen(process.env.PORT || 3001, () => {
  console.log('Server started at', new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  console.log(`Server running on port ${process.env.PORT || 3001}`);
  // executeUpdateStatus();
});