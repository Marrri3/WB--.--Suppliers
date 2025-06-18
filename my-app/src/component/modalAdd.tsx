import React, { useState } from 'react';
import { NewOrder } from '../utils/types';
import { DayPicker } from 'react-day-picker';
import { filterCity, filterDelivery, filterWarehouse, filterStatus } from '../utils/filtersData';
import 'react-day-picker/dist/style.css';
import '../static/modalAdd.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    addOrder: (newOrder: NewOrder) => void;
}

const ModalAdd: React.FC<ModalProps> = ({ isOpen, onClose, addOrder }) => {
    //хранение данных
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDelivery, setSelectedDelivery] = useState<string>('');
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [quantity, setQuantity] = useState<number | string>('');

    //управление видимостью
    const [visibleMenu, setVisibleMenu] = useState<number | null>(null);
    const [calendarVisible, setCalendarVisible] = useState(false);

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
        if (calendarVisible) setCalendarVisible(false);
        setVisibleMenu(null);
    };

    const handleCalendarToggle = () => {
        if (visibleMenu !== null) setVisibleMenu(null);
        setCalendarVisible(!calendarVisible);
    };

    const toggleMenu = (menuId: number) => {
        if (calendarVisible) setCalendarVisible(false);
        setVisibleMenu(visibleMenu === menuId ? null : menuId);
    };

    //проверка полей и добавление поставки
    const handleSave = async () => {
        if (!quantity || !selectedDate) {
            alert('Заполните обязательные поля: количество и дату доставки!');
            return;
        }
        if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
            alert('Количество должно быть положительным числом!');
            return;
        }
        const warehouse = filterWarehouse.find(w => w.label === (selectedWarehouse || 'Склад'));
        const warehouseId = warehouse ? warehouse.id : 1;
        const currentDate = new Date().toISOString().split('T')[0];

        //получение id пользователя из хранилища 
        const storedUserId = localStorage.getItem('userId');
        const userId = storedUserId ? parseInt(storedUserId, 10) : 1;
        // console.log('Stored userId from localStorage:', storedUserId, 'Parsed userId:', userId);

        const newOrder: NewOrder = {
            deliveryDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            shipDate: currentDate,
            quantity: Number(quantity),
            city: selectedCity || 'Москва',
            deliveryType: selectedDelivery || 'Короб',
            warehouseId: warehouseId,
            status: selectedStatus || 'В пути',
            title: '', 
            createdBy: userId,
        };
        try {
            //добавление поставки
            await addOrder(newOrder);
            console.log('Order added successfully:', newOrder);
            onClose();
        } catch (error) {
            console.error('Error adding order:', error);
            alert('Не удалось добавить поставку. Попробуйте снова.');
        }
    };

    if (!isOpen) return null;

    //выпадающие списки для разных полей
    const renderDropdown = (title: string, value: string, setValue: (value: string) => void, options: { id: number; label: string }[], menuId: number) => (
        <div className="data-wrapper">
            <div className="data-title">{title}</div>
            <div className="data" onClick={() => toggleMenu(menuId)}>
                <div className="text-data">{value || title === 'Город' ? 'Москва' : title === 'Тип поставки' ? 'Короб' : title === 'Склад' ? 'Склад' : 'В пути'}</div>
                <div className="container-icon">
                    <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
                </div>
                {visibleMenu === menuId && (
                    <div className="add-modal-dropdown-menu">
                        <ul>
                            {options.map(option => (
                                <li key={option.id} onClick={() => { setValue(option.label); handleSelect(title.toLowerCase(), option.label); }}>
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="add-modal">
            <div className="add-modal-content">
                <button className="close" onClick={onClose}>
                    <img src="./icon-close.png" alt="close-action" />
                </button>
                <div className="title-container">
                    <h2 className="modal-title">Новая поставка</h2>
                </div>
                <div className="data-container">
                    <div className="data-title">Дата доставки</div>
                    <div className="data">
                        <div className="calendar-data">
                            {selectedDate ? selectedDate.toLocaleDateString() : '__.__.____'}
                        </div>
                        <div className="container-icon" onClick={handleCalendarToggle}>
                            <img src="./icon-cal.png" alt="dropdown" className="dropdown-icon" />
                        </div>
                        {calendarVisible && (
                            <div className="calendar">
                                <DayPicker
                                    selected={selectedDate}
                                    onDayClick={(day) => {
                                        setSelectedDate(day);
                                        setCalendarVisible(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {renderDropdown('Город', selectedCity, setSelectedCity, filterCity, 1)}
                    {renderDropdown('Тип поставки', selectedDelivery, setSelectedDelivery, filterDelivery, 2)}
                    <div className="data-title">Количество</div>
                    <div className="data">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0"
                            className="input-data"
                            pattern="[0-9]*"
                            required
                        />
                        <div className="container-icon">
                            <div className="hint">шт.</div>
                        </div>
                    </div>
                    {renderDropdown('Склад', selectedWarehouse, setSelectedWarehouse, filterWarehouse, 3)}
                    {renderDropdown('Статус', selectedStatus, setSelectedStatus, filterStatus, 4)}
                </div>
                <div className="button-container">
                    <button className="button-save" onClick={handleSave}>Сохранить</button>
                    <button className="button-cancel" onClick={onClose}>Отменить</button>
                </div>
            </div>
        </div>
    );
};

export default ModalAdd;