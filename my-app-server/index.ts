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

// получение всех заказов
app.get('/api/orders', (req: Request, res: Response) => {
    res.json(orders);
});

// добавление заказов
app.post('/api/orders', (req: Request, res: Response) => {
    const newOrder: Order = req.body; 
    orders.push(newOrder); // Добавляем новый заказ в массив
    res.status(201).json({ success: true, data: newOrder }); // Возвращаем созданный заказ
});

// удаление заказов
app.delete('/api/orders', (req: Request, res: Response) => {
    const { ids }: { ids: number[] } = req.body; // Ожидаем массив id в теле запроса
    orders = orders.filter(order => !ids.includes(order.id)); // Удаляем заказы с указанными id
    res.status(204).send(); // Возвращаем статус 204 No Content
});

// обновление заказа
app.patch('/api/orders/:id', (req: Request, res: Response) => {
    const updatedData: Partial<Order> = req.body; // Получаем обновленные данные из тела запроса
    const id = parseInt(req.params.id); // Получаем id из параметров URL
    
    const orderIndex = orders.findIndex(order => order.id === id); // Находим индекс заказа
    if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updatedData }; // Обновляем данные заказа
        res.json({ success: true, data: orders[orderIndex] }); // Возвращаем обновленный заказ
    } else {
        res.status(404).json({ success: false, message: 'Заказ не найден' }); // Если заказ не найден
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});