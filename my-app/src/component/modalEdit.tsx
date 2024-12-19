import React, { useState } from 'react';
import '../static/modalEdit.css';
import { editOrder } from '../api/requests/OrderdRequests';

const filterCity = [
  { id: 1, label: 'Москва' },
  { id: 2, label: 'Псков' },
  { id: 3, label: 'Тверь' },
  { id: 4, label: 'Абакан' },
  { id: 5, label: 'Нижний Новгород' },
  { id: 6, label: 'Кострома' },
  { id: 7, label: 'Ярославль' }
];

const filterDelivery = [
  { id: 1, label: 'Короб' },
  { id: 2, label: 'Монопаллета' },
];

const filterWarehouse = [
  { id: 1, label: 'Склад' },
  { id: 2, label: 'СЦ Абакан' },
  { id: 3, label: 'Черная грязь' },
  { id: 4, label: 'Внуково' },
  { id: 5, label: 'Белая дача' },
  { id: 6, label: 'Электросталь' },
  { id: 7, label: 'Вёшки' }
];

const filterStatus = [
  { id: 1, label: 'В пути' },
  { id: 2, label: 'Задерживается' },
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, initialData }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [quantity, setQuantity] = useState(initialData.quantity || 0);

  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);

  const handleSelect = (type: string, value: string) => {
    switch(type) {
      case 'city':
        setSelectedCity(value);
        break;
      case 'delivery':
        setSelectedDelivery(value);
        break;
      case 'warehouse':
        setSelectedWarehouse(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      default:
        break;
    }
    setVisibleMenu(null);  // Закрываем все меню
  };

  const toggleMenu = (menuId: number) => {
    setVisibleMenu(visibleMenu === menuId ? null : menuId);
  };

  const handleSave = async () => {
    const updatedOrder = {
      quantity: typeof quantity === 'number' ? quantity : initialData.quantity,
      city: selectedCity || initialData.city, 
      deliveryType: selectedDelivery || initialData.deliveryType, 
      warehouse: { 
        name: selectedWarehouse || initialData.warehouse.name, 
        address: selectedWarehouse ? null : initialData.warehouse.address,
      }, 
      status: selectedStatus || initialData.status, 
    };

    try {
        await editOrder(initialData.id, updatedOrder); // Используем id из initialData
        console.log('Заказ обновлён');
        onClose(); // Закрыть модальное окно
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <button className="close" onClick={onClose}>
          <img src='./icon-close.png' alt='close-action' />
        </button>
  
        <div className='title-container'>
          <h2 className='modal-title'>Редактирование</h2>
          {initialData && <p className='subtitle'>#{initialData.id}</p>}
        </div>
  
        <div className='data-container'>
          
          <div className='data-title'>Город</div>
          <div className='data' onClick={() => toggleMenu(1)} style={{ position: 'relative' }}>
            <div className='text-data'>{selectedCity || initialData?.city}</div>
            {visibleMenu === 1 && (
              <div className='edit-modal-dropdown-menu'>
                <ul>
                  {filterCity.map(option => (
                    <li key={option.id} onClick={() => handleSelect('city', option.label)}>
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
  
          <div className='data-title'>Тип поставки</div>
          <div className='data' onClick={() => toggleMenu(2)} style={{ position: 'relative' }}>
            <div className='text-data'>{selectedDelivery || initialData?.deliveryType}</div>
            {visibleMenu === 2 && (
              <div className='edit-modal-dropdown-menu'>
                <ul>
                  {filterDelivery.map(option => (
                    <li key={option.id} onClick={() => handleSelect('delivery', option.label)}>
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
  
          <div className='data-title'>Количество</div>
          <div className='data'>
            {initialData && 
              <input 
                className='input-data'
                type="number" 
                value={quantity} // Убедитесь, что quantity - это число
                onChange={(e) => {
                const newValue = e.target.value;
                setQuantity(newValue ? parseFloat(newValue) : 0); // Преобразуем строку в число, если пусто, ставим 0
              }} 
                placeholder={initialData.quantity}>
            </input>}

            <div className='container-icon'>
              <div className='hint'>шт.</div> 
            </div>
          </div>
  
          <div className='data-title'>Склад</div>
          <div className='data' onClick={() => toggleMenu(3)} style={{ position: 'relative' }}>
            <div className='text-data'>{selectedWarehouse || initialData?.warehouse.name}</div>
            {visibleMenu === 3 && (
              <div className='edit-modal-dropdown-menu'>
                <ul>
                  {filterWarehouse.map(option => (
                    <li key={option.id} onClick={() => handleSelect('warehouse', option.label)}>
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
  
          <div className='data-title'>Статус</div>
          <div className='data' onClick={() => toggleMenu(4)} style={{ position: 'relative' }}>
            <div className='text-data'>{selectedStatus || initialData?.status}</div>
            {visibleMenu === 4 && (
              <div className='edit-modal-dropdown-menu'>
                <ul>
                  {filterStatus.map(option => (
                    <li key={option.id} onClick={() => handleSelect('status', option.label)}>
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
  
        </div>
        <div className='button-container'>
          <button className='button-save' onClick={handleSave}>Сохранить</button>
          <button className='button-cancel' onClick={onClose}>Отменить</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;