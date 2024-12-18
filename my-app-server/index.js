"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
// остальные настройки и маршруты
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
let orders = [
    { id: 154814, deliveryDate: '28.06.2024', city: 'Москва', quantity: 487, deliveryType: 'Короб', warehouse: { name: 'Черная грязь', address: 'д. Черная Грязь, ул. Промышленная, с.2' }, status: 'В пути' },
    { id: 26589, deliveryDate: '26.06.2024', city: 'Москва', quantity: 895, deliveryType: 'Монопалетта', warehouse: { name: 'Вёшки', address: 'Липкинское шоссе, 2-ой километр, посёлок Вёшки' }, status: 'В пути' },
    { id: 984153, deliveryDate: '26.06.2024', city: 'Псков', quantity: 748, deliveryType: 'Короб', warehouse: { name: 'Склад', address: 'ул. Индустриальная, д. 9/1' }, status: 'Задерживается' },
];
// Endpoint для получения всех заказов
app.get('/api/orders', (req, res) => {
    res.json(orders);
});
wss.clients.forEach(client => {
    if (client.readyState === ws_1.default.OPEN) {
        client.send(JSON.stringify(orders));
    }
});
