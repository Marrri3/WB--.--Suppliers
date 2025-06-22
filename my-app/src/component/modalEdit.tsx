import React, { useState, useEffect } from 'react';
import '../static/modalEdit.css';
import { Shipment } from '../utils/types';
import { filterCity, filterDelivery, filterWarehouse, filterStatus } from '../utils/filtersData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Shipment;
  onSave: (updatedData: Partial<Shipment>) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<Partial<Shipment>>({
    city: '',
    delivery_type: '',
    warehouse_name: '',
    status: '',
    quantity: 0,
    delivery_date: '',
  });
  const [visibleMenu, setVisibleMenu] = useState<number | null>(null);

  //заполнение формы начальными данными
  useEffect(() => {
    if (!isOpen || !initialData) return;

    setFormData({
      city: initialData.city || '',
      delivery_type: initialData.delivery_type || '',
      warehouse_name: initialData.warehouse_name || '',
      status: initialData.status || '',
      quantity: initialData.quantity || 0,
      delivery_date: initialData.delivery_date ? new Date(initialData.delivery_date).toLocaleDateString('en-CA') : '',
    });
  }, [initialData, isOpen]);

  const handleSelect = (type: keyof Partial<Shipment>, value: string) => {
    setFormData(prev => ({ ...prev, [type]: value }));
    setVisibleMenu(null);
  };

  const toggleMenu = (menuId: number) => setVisibleMenu(visibleMenu === menuId ? null : menuId);

  // Проверка на правильное заполнение полей 
  const validateForm = (): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = formData.delivery_date ? new Date(formData.delivery_date) : null;
    if (selectedDate && selectedDate < today) return 'Нельзя выбирать прошедшую дату!';
    if (formData.quantity! <= 0) return 'Количество должно быть положительным числом';
    if (formData.delivery_date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.delivery_date))
      return 'Неверный формат даты (ожидается YYYY-MM-DD)';
    if (!formData.city || !formData.delivery_type || !formData.warehouse_name || !formData.status)
      return 'Все поля должны быть заполнены';
    return null;
  };

  //сохранение изменений
  const handleSave = () => {
    const error = validateForm();
    if (error) return alert(error);

    onSave(formData);
    onClose();
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0;
    setFormData(prev => ({ ...prev, quantity: value }));
  };

  if (!isOpen) return null;

  //выпадающие списки для разных полей 
  const renderDropdown = (title: string, field: keyof Partial<Shipment>, options: { id: number; label: string }[], menuId: number) => (
    <div>
      <div className="data-title">{title}</div>
      <div className="data" onClick={() => toggleMenu(menuId)}>
        <div className="text-data">{formData[field] || ''}</div>
        {visibleMenu === menuId && (
          <div className="edit-modal-dropdown-menu">
            <ul>
              {options.map(option => (
                <li key={option.id} onClick={() => handleSelect(field, option.label)}>{option.label}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="container-icon"><img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" /></div>
    </div>
    </div>
  );

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <button className="close" onClick={onClose}><img src="./icon-close.png" alt="close-action" /></button>
        <div className="title-container">
          <h2 className="modal-title">Редактирование</h2>
          {initialData && <p className="subtitle">#{initialData.id}</p>}
        </div>
        <div className="data-container">
          {renderDropdown('Город', 'city', filterCity, 1)}
          {renderDropdown('Тип поставки', 'delivery_type', filterDelivery, 2)}
          <div className="data-title">Количество</div>
          <div className="data">
            <input
              className="input-data"
              type="number"
              value={formData.quantity || 0}
              onChange={handleQuantityChange}
              placeholder={initialData?.quantity?.toString()}
            />
            <div className="container-icon"><div className="hint">шт.</div></div>
          </div>
          {renderDropdown('Склад', 'warehouse_name', filterWarehouse, 3)}
          <div className="data-title">Дата поставки</div>
          <div className="data">
            <input
              className="input-data"
              type="date"
              value={formData.delivery_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
            />
          </div>
          {renderDropdown('Статус', 'status', filterStatus, 4)}
        </div>
        <div className="button-container">
          <button className="button-save" onClick={handleSave}>Сохранить</button>
          <button className="button-cancel" onClick={onClose}>Отменить</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;