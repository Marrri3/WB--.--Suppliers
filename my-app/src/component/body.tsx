import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../api/requests/OrderdRequests'; // Убедитесь, что здесь правильный путь к вашему файлу
import '../static/body.css';
import Modal from './modalEdit';

const SupplyTable: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]); // Состояние для хранения заказов
    const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(false); // Состояние для управления модальным окном
    const [currentOrder, setCurrentOrder] = useState<any>(null); // Измените тип на any или определите интерфейс для заказа

    // Получение заказов
    const getOrders = async () => {
        try {
            const fetchedOrders = await fetchOrders();
            setOrders(fetchedOrders); // Установка полученных данных в состояние
        } catch (error) {
            console.error('Ошибка при получении заказов:', error);
        }
    };


    // Вызываем getOrders при монтировании компонента
    useEffect(() => {
        getOrders();
    }, []); // Пустой массив зависимостей означает, что функция выполнится только один раз при монтировании


    const getStatusClass = (status: string) => {
        switch (status) {
            case 'В пути':
                return 'cell-status in-transit';
            case 'Задерживается':
                return 'cell-status delayed';
            default:
                return 'cell-status';
        }
    };

    const handleClick = (id: number) => {
        setVisibleMenuId(prevId => (prevId === id ? null : id));
    };

    const handleEditClick = (order: any) => {
        setCurrentOrder(order); // Устанавливаем текущий заказ
        setModalOpen(true); // Открываем модальное окно
        setVisibleMenuId(null);
    };

    const closeModal = () => {
        setModalOpen(false); // Закрываем модальное окно
        setCurrentOrder(null); // Сбрасываем выбранный заказ
    };

    return (
        <div className="table-container">
            <table className="supply-table">
                <thead>
                    <tr className="head-row">
                        <th>Номер</th>
                        <th>Дата Поставки</th>
                        <th>Город</th>
                        <th>Количество</th>
                        <th>Тип Поставки</th>
                        <th>Склад</th>
                        <th>Статус</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr className="table-row" key={order.id}>
                            <td className="table-cell">{order.id}</td>
                            <td className="table-cell">{order.deliveryDate}</td>
                            <td className="table-cell">{order.city}</td>
                            <td className="table-cell">{order.quantity} шт.</td>
                            <td className="table-cell">{order.deliveryType}</td>
                            <td className="table-cell">
                                <div>{order.warehouse.name}</div>
                                <div className='warehouse-address'>{order.warehouse.address}</div>
                            </td>
                            <td className="table-cell">
                                <div className={getStatusClass(order.status)}>{order.status}</div>
                            </td>
                            <td className="table-cell">
                                <div style={{ position: 'relative' }}>
                                    <button className='button-icon' onClick={() => handleClick(order.id)}>
                                        <img src='./icon-kebab.png' alt="Actions" />
                                    </button>
                                    {visibleMenuId === order.id && (
                                        <div className='dropdown-menu'>
                                            <ul>
                                                <li onClick={() => handleEditClick(order)}>Редактировать</li>
                                                <li>Отменить поставку</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && currentOrder && ( 
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={closeModal}
                    initialData={currentOrder} 
                />
            )}
        </div>
    );
};

export default SupplyTable;