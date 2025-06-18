import React, { useState, useEffect } from 'react';
import '../static/modalUserEdit.css';
import { User } from '../utils/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<User>) => void;
  initialData?: User; //начальные данные
}

const ModalUserEdit: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  //инициализация начальными данными
  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email || '');
      setName(initialData.name || '');
    }
  }, [initialData]);

  //проверка полей и сохранение изменение, при наличии
  const handleSave = async () => {
    if (!name && !email) {
      alert('Измените хотя бы одно поле');
      return;
    }
    try {
      await onSave({ email, name });
      onClose();
    } catch (err) {
      alert('Ошибка при сохранении изменений');
      console.error('Save error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-edit-modal">
      <div className="user-edit-modal-content">
        <button className="close" onClick={onClose}>
          <img src="./icon-close.png" alt="close-action" />
        </button>
        <div className="title-container-user-edit">
          <h2 className="modal-title-user-edit">Профиль</h2>
        </div>
        <div className="data-container">
          <div className="data-title-user-edit">Имя</div>
          <div className="data-user-edit">
            <input
              className="input-data-user-edit"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="data-title-user-edit">Логин</div>
          <div className="data-user-edit">
            <input
              className="input-data-user-edit"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="button-container">
          <button className="button-save" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUserEdit;