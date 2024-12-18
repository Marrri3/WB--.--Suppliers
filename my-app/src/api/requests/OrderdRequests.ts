// src/api/OrderRequests.ts

import ORDER_ENDPOINT from '../endpoints/OrderEndpoints';

// Функция для получения всех заказов
export const fetchOrders = async () => {
    try {
        const response = await fetch(ORDER_ENDPOINT);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const addOrder = async (newOrder: { id: number; deliveryDate: string; 
city: string; quantity: number; deliveryType: string;
warehouse: { name: string; address: string }; status: string }) => {
    try {
        const response = await fetch(ORDER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding order:', error);
        throw error;
    }
};