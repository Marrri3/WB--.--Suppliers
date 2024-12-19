"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json()); // Middleware для обработки JSON-данных
let orders = [
    { id: 154814, deliveryDate: '28.06.2024', city: 'Москва', quantity: 487, deliveryType: 'Короб', warehouse: { name: 'Черная грязь', address: 'д. Черная Грязь, ул. Промышленная, с.2' }, status: 'В пути' },
    { id: 26589, deliveryDate: '26.06.2024', city: 'Москва', quantity: 895, deliveryType: 'Монопалетта', warehouse: { name: 'Вёшки', address: 'Липкинское шоссе, 2-ой километр, посёлок Вёшки' }, status: 'В пути' },
    { id: 984153, deliveryDate: '26.06.2024', city: 'Псков', quantity: 748, deliveryType: 'Короб', warehouse: { name: 'Склад', address: 'ул. Индустриальная, д. 9/1' }, status: 'Задерживается' },
];
// получение всех заказов
app.get('/api/orders', (req, res) => {
    res.json(orders);
});
// добавление заказов
app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    orders.push(newOrder); // Добавляем новый заказ в массив
    res.status(201).json({ success: true, data: newOrder }); // Возвращаем созданный заказ
});
// удаление заказов
app.delete('/api/orders', (req, res) => {
    const { ids } = req.body; // Ожидаем массив id в теле запроса
    orders = orders.filter(order => !ids.includes(order.id)); // Удаляем заказы с указанными id
    res.status(204).send(); // Возвращаем статус 204 No Content
});
// обновление заказа
app.patch('/api/orders/:id', (req, res) => {
    const { updatedData } = req.body; // Получаем обновленные данные из тела запроса
    const id = parseInt(req.params.id); // Получаем id из параметров URL
    const orderIndex = orders.findIndex(order => order.id === id); // Находим индекс заказа
    if (orderIndex !== -1) {
        orders[orderIndex] = Object.assign(Object.assign({}, orders[orderIndex]), updatedData); // Обновляем данные заказа
        res.json({ success: true, data: orders[orderIndex] }); // Возвращаем обновленный заказ
    }
    else {
        res.status(404).json({ success: false, message: 'Заказ не найден' }); // Если заказ не найден
    }
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
