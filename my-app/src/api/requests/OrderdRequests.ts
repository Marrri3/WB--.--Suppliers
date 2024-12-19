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

export const addOrder = async (newOrder: { id: number;
city: string; quantity: number; deliveryType: string;
warehouse: { name: string }; status: string }) => {
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

// Функция для удаления заказа
export const deleteOrders = async (ids: number[]): Promise<void> => {
    console.log('Отправка запроса на удаление заказов с ID:', ids);
    const response = await fetch(ORDER_ENDPOINT, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }), // Отправляем массив id в теле запроса
    });
    if (!response.ok) {
        throw new Error(`Ошибка при удалении заказов: ${response.status} ${response.statusText}`);
    }
};


export const editOrder = async (orderId: number, updatedFields: Partial<{
    city: string;
    quantity: number;
    warehouse: { name: string, address: string };
    status: string;
}>): Promise<void> => {
    try {
        const response = await fetch(`${ORDER_ENDPOINT}/${orderId}`, { // Добавляем orderId в URL
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Заказ обновлен:', data);
    } catch (error) {
        console.error('Ошибка при редактировании заказа:', error);
        throw error;
    }
};