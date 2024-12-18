// index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json()); // Middleware для обработки JSON-данных

interface Warehouse {
    name: string;
    address: string;
}

interface Order {
    id: number;
    deliveryDate: string;
    city: string;
    quantity: number;
    deliveryType: string;
    warehouse: Warehouse;
    status: string;
}

let orders: Order[] = [
    { id: 154814, deliveryDate: '28.06.2024', city: 'Москва', quantity: 487, deliveryType: 'Короб', warehouse: { name: 'Черная грязь', address: 'д. Черная Грязь, ул. Промышленная, с.2' }, status: 'В пути' },
    { id: 26589, deliveryDate: '26.06.2024', city: 'Москва', quantity: 895, deliveryType: 'Монопалетта', warehouse: { name: 'Вёшки', address: 'Липкинское шоссе, 2-ой километр, посёлок Вёшки' }, status: 'В пути' },
    { id: 984153, deliveryDate: '26.06.2024', city: 'Псков', quantity: 748, deliveryType: 'Короб', warehouse: { name: 'Склад', address: 'ул. Индустриальная, д. 9/1' }, status: 'Задерживается' },
];

// Endpoint для получения всех заказов
app.get('/api/orders', (req: Request, res: Response) => {
    res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
    const newOrder: Order = req.body; 
    orders.push(newOrder); // Добавляем новый заказ в массив
    res.status(201).json({ success: true, data: newOrder }); // Возвращаем созданный заказ
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});