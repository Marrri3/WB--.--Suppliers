"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./cron/updateStatus");
const database_1 = __importDefault(require("./database")); // Импортируем пул
require("dotenv/config");
const app = (0, express_1.default)();
// const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Middleware для обработки JSON-данных
app.get('/test-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT NOW()');
        res.json({ message: 'Database connected', time: result.rows[0] });
    }
    catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
}));
// // получение всех заказов
// app.get('/api/orders', (req: Request, res: Response) => {
//     res.json(orders);
// });
// // добавление заказов
// app.post('/api/orders', (req: Request, res: Response) => {
//     const newOrder: Order = req.body; 
//     orders.push(newOrder); // Добавляем новый заказ в массив
//     res.status(201).json({ success: true, data: newOrder }); // Возвращаем созданный заказ
// });
// // удаление заказов
// app.delete('/api/orders', (req: Request, res: Response) => {
//     const { ids }: { ids: number[] } = req.body; // Ожидаем массив id в теле запроса
//     orders = orders.filter(order => !ids.includes(order.id)); // Удаляем заказы с указанными id
//     res.status(204).send(); // Возвращаем статус 204 No Content
// });
// // обновление заказа
// app.patch('/api/orders/:id', (req: Request, res: Response) => {
//     const updatedData: Partial<Order> = req.body; // Получаем обновленные данные из тела запроса
//     const id = parseInt(req.params.id); // Получаем id из параметров URL
//     const orderIndex = orders.findIndex(order => order.id === id); // Находим индекс заказа
//     if (orderIndex !== -1) {
//         orders[orderIndex] = { ...orders[orderIndex], ...updatedData }; // Обновляем данные заказа
//         res.json({ success: true, data: orders[orderIndex] }); // Возвращаем обновленный заказ
//     } else {
//         res.status(404).json({ success: false, message: 'Заказ не найден' }); // Если заказ не найден
//     }
// });
// // Запуск сервера
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
