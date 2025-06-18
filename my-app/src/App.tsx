import React, { useState, useEffect } from 'react';
import Head from './component/head';
import SupplyTable from './component/SupplyTable';
import Catalog from './component/catalog';
import { fetchOrders, updateOrder, deleteOrders } from './api/requests/OrderdRequests';
import { getMe } from './api/requests/UsersRequests'; 
import { Shipment } from './utils/types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Shipment[]>([]);
  const [sortBy, setSortBy] = useState<string>('По номеру');
  const [searchValue, setSearchValue] = useState<string>('');

  //проверка токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkAuth = async () => {
        try {
          await getMe(); 
          setIsAuthenticated(true); 
          handleOrderCreated(); 
        } catch (error) {
          console.error('Auth check error:', error);
          if (error instanceof Response && error.status === 401) {
            localStorage.removeItem('token'); 
            setIsAuthenticated(false);
          }
        }
      };
      checkAuth();
    } else {
      console.log('No token found, isAuthenticated remains false');
    }
  }, []); 

  //получение и обновление заказов
  const handleOrderCreated = async () => {
    try {
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
    }
  };

  //удаление заказа
  const handleOrderDeleted = async (orderId: number) => {
    try {
      await deleteOrders([orderId]);
      setOrders(orders.filter(order => order.id !== orderId));
      alert('Заказ успешно отменен');
    } catch (error) {
      console.error('Ошибка при отмене заказа:', error);
      alert('Не удалось отменить заказ');
      await handleOrderCreated();
    }
  };

  //редактирование заказа
  const handleOrderUpdated = async (orderId: number, updatedData: Partial<Shipment>) => {
    try {
      await updateOrder(orderId, updatedData);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, ...updatedData } : order
      ));
      alert('Заказ успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении заказа:', error);
      alert('Не удалось обновить заказ');
      await handleOrderCreated();
    }
  };

  //инициализация данных
  useEffect(() => {
    if (isAuthenticated) {
      handleOrderCreated();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Head
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Catalog
        isAuthenticated={isAuthenticated}
        onOrderCreated={handleOrderCreated}
        setSortBy={setSortBy}
        setSearchValue={setSearchValue}
      />
      <SupplyTable
        isAuthenticated={isAuthenticated}
        orders={orders}
        onOrderDeleted={handleOrderDeleted}
        onOrderUpdated={handleOrderUpdated}
        sortBy={sortBy}
        searchValue={searchValue}
      />
    </div>
  );
};

export default App;