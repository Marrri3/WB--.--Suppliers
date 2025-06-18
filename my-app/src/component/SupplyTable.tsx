import React, { useState, useMemo } from 'react';
import '../static/body.css';
import { Shipment } from '../utils/types';
import Modal from './modalEdit';

interface SupplyTableProps {
  isAuthenticated: boolean;
  orders: Shipment[];
  onOrderDeleted: (orderId: number) => void;
  onOrderUpdated: (orderId: number, updatedData: Partial<Shipment>) => void;
  sortBy?: string;
  searchValue?: string;
}

const SupplyTable: React.FC<SupplyTableProps> = ({ isAuthenticated, orders, onOrderDeleted, onOrderUpdated, sortBy, searchValue }) => {
  const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Shipment | null>(null);

  //сортировка и фильтрация 
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    //фильтрация по поиску
    if (searchValue) {
      const lowerCaseSearch = searchValue.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(lowerCaseSearch) ||
        order.city.toLowerCase().includes(lowerCaseSearch) ||
        (order.delivery_type && order.delivery_type.toLowerCase().includes(lowerCaseSearch)) ||
        (order.status && order.status.toLowerCase().includes(lowerCaseSearch)) ||
        (order.warehouse_name && order.warehouse_name.toLowerCase().includes(lowerCaseSearch))
      );
    }

    //сортировка по критерию
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'По номеру':
            return a.id - b.id;
          case 'По городу':
            return a.city.localeCompare(b.city);
          case 'По типу поставки':
            return a.delivery_type.localeCompare(b.delivery_type);
          case 'По статусу':
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [sortBy, orders, searchValue]);

  //отмена поставки
  const handleCancelDelivery = async (orderId: number) => {
    if (onOrderDeleted) {
      onOrderDeleted(orderId);
    }
  };

  //изменение поставки 
  const handleEditOrder = async (orderId: number, updatedData: Partial<Shipment>) => {
    if (onOrderUpdated) {
      onOrderUpdated(orderId, updatedData);
    }
  };

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
    setVisibleMenuId((prevId) => (prevId === id ? null : id));
  };

  //модальное окно редактирования 
  const handleEditClick = (order: Shipment) => {
    setCurrentOrder(order);
    setModalOpen(true);
    setVisibleMenuId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  return (
    <div className="table-container">
      <table className="supply-table">
        {/* Заголовки таблицы отображаются всегда */}
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
        {isAuthenticated ? (
          <tbody>
            {filteredAndSortedOrders.length > 0 ? (
              filteredAndSortedOrders.map((order) => (
                <tr className="table-row" key={order.id}>
                  <td className="table-cell">{order.id}</td>
                  <td className="table-cell">
                    {(() => {
                      const dateValue = order.delivery_date;
                      const date = new Date(dateValue);
                      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                    })()}
                  </td>
                  <td className="table-cell">{order.city}</td>
                  <td className="table-cell">{order.quantity} шт.</td>
                  <td className="table-cell">{order.delivery_type}</td>
                  <td className="table-cell">
                    <div>{order.warehouse_name}</div>
                    <div className="warehouse-address">{order.warehouse_address}</div>
                  </td>
                  <td className="table-cell">
                    <div className={getStatusClass(order.status)}>{order.status}</div>
                  </td>
                  <td className="table-cell">
                    <div style={{ position: 'relative' }}>
                      <button className="button-icon" onClick={() => handleClick(order.id)}>
                        <img src="./icon-kebab.png" alt="Actions" />
                      </button>
                      {visibleMenuId === order.id && (
                        <div className="dropdown-menu">
                          <ul>
                            <li onClick={() => handleEditClick(order)}>Редактировать</li>
                            <li onClick={() => handleCancelDelivery(order.id)}>Отменить поставку</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="error-title" style={{ textAlign: 'center' }}>
                  Нет доступных поставок.
                </td>
              </tr>
            )}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={8} className="error-title" style={{ textAlign: 'center' }}>
                Пожалуйста, авторизуйтесь для просмотра поставок.
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {isModalOpen && currentOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          initialData={currentOrder}
          onSave={(updatedData: Partial<Shipment>) => handleEditOrder(currentOrder.id, updatedData)}
        />
      )}
    </div>
  );
};

export default SupplyTable;