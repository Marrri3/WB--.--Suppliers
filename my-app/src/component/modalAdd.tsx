import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Импорт стиле
import '../static/modalAdd.css';  // Импортируйте стили для вашего модального окна

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
  addOrder: (newOrder: any) => void;
}

const ModalAdd: React.FC<ModalProps> = ({ isOpen, onClose, addOrder }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [generatedRandomNumber, setGeneratedRandomNumber] = useState(''); 
  const [quantity, setQuantity] = useState<number | string>('');

  const handleSelect = (type: string, value: string) => {
    switch (type) {
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

    if (calendarVisible) {
      setCalendarVisible(false);
    }

    setVisibleMenu(null);
  };

  const handleCalendarToggle = () => {
    if (visibleMenu !== null) {
      setVisibleMenu(null);
    }
    setCalendarVisible(!calendarVisible);
  };

  const toggleMenu = (menuId: number) => {
    if (calendarVisible) {
      setCalendarVisible(false);
    }

    if (visibleMenu === menuId) {
      setVisibleMenu(null);
    } else {
      setVisibleMenu(menuId);
    }
  };

  const generateRandomNumber = () => {
    const number = Math.floor(100000 + Math.random() * 900000);
    setGeneratedRandomNumber(`#${number}`); // Используем новое имя состояния
  };

  useEffect(() => {
    generateRandomNumber();
  }, []);

  const handleSave = async () => {
    const newOrder = {
      id: parseInt(generatedRandomNumber.slice(1), 10),
      deliveryDate: selectedDate ? selectedDate.toLocaleDateString() : '',
      quantity: quantity,
      city: selectedCity,
      deliveryType: selectedDelivery,
      warehouse: { name: selectedWarehouse, address: '' },
      status: selectedStatus,
    };
    console.log('данные приняты')

    try {
      await addOrder(newOrder); // Отправка нового заказа на сервер
      console.log('Order added successfully');
      console.log('New order data:', newOrder);
      onClose(); // Закрытие модального окна
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-modal">
      <div className="add-modal-content">
        <button className="close" onClick={onClose}>
          <img src='./icon-close.png' alt='close-action'></img>
        </button>

        <div className='title-container'>
          <h2 className='modal-title'>Новая поставка</h2>
          <p className="subtitle">{generatedRandomNumber}</p>
        </div>

        <div className='data-container'>

        <div className='data'>
        
        <div className='calendar-data'>
          {selectedDate ? selectedDate.toLocaleDateString() : '__.__.____'}
        </div>
        <div className='container-icon' onClick={handleCalendarToggle}>
          <img src="./icon-cal.png" alt="dropdown" className="dropdown-icon" />
        </div>
  
        {calendarVisible && (
          <div className='calendar'>
            <DayPicker
              selected={selectedDate}
              onDayClick={(day) => {
              setSelectedDate(day);
              setCalendarVisible(false); // Закрываем календарь после выбора даты
            }}
          />
          </div>
        )}
        </div>

          <div className='data-title'>Город</div>
          <div className='data' onClick={() => toggleMenu(1)}>
            <div className='text-data'>{selectedCity || 'Москва'}</div>
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
          {visibleMenu === 1 && (
            <div className='add-modal-dropdown-menu'>
              <ul>
                {filterCity.map(option => (
                  <li key={option.id} onClick={() => handleSelect('city', option.label)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='data-title'>Тип поставки</div>
          <div className='data' onClick={() => toggleMenu(2)}>
            <div className='text-data'>{selectedDelivery || 'Короб'}</div>
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
          {visibleMenu === 2 && (
            <div className='add-modal-dropdown-menu'>
              <ul>
                {filterDelivery.map(option => (
                  <li key={option.id} onClick={() => handleSelect('delivery', option.label)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='data-title'>Количество</div>
          <div className='data'>
          <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                placeholder="0" 
                className='input-data'
                pattern="[0-9]*"
            />
            <div className='container-icon'>
              <div className='hint'>шт.</div> 
            </div>
          </div>

          <div className='data-title'>Склад</div>
          <div className='data' onClick={() => toggleMenu(3)}>
            <div className='text-data'>{selectedWarehouse || 'Склад'}</div>
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
          {visibleMenu === 3 && (
            <div className='add-modal-dropdown-menu'>
              <ul>
                {filterWarehouse.map(option => (
                  <li key={option.id} onClick={() => handleSelect('warehouse', option.label)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='data-title'>Статус</div>
          <div className='data' onClick={() => toggleMenu(4)}>
            <div className='text-data'>{selectedStatus || 'В пути'}</div>
            <div className='container-icon'>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </div>
          </div>
          {visibleMenu === 4 && (
            <div className='add-modal-dropdown-menu'>
              <ul>
                {filterStatus.map(option => (
                  <li key={option.id} onClick={() => handleSelect('status', option.label)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <div className='button-container'>
          <button className='button-save' onClick={handleSave}>Сохранить</button>
          <button className='button-cancel' onClick={onClose}>Отменить</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdd;