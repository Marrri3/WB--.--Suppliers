import React, { useState } from 'react';
import ModalReg from './modalReg';
import '../static/modalAuth.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, password: string) => void;
  onRegisterSuccess: (name: string, email: string, password: string) => void;
}

const ModalAuth: React.FC<ModalProps> = ({ isOpen, onClose, onLoginSuccess, onRegisterSuccess }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuthClick = async () => {
    if (!email || !password) {
      alert('Email и пароль обязательны' );
      return;
    }
    try {
      //авторизация пользователя
      await onLoginSuccess(email, password);
      setError(null);
      onClose();
    } catch (err) {
      setError('Ошибка входа. Проверьте email и пароль.');
      console.error('Login error:', err);
    }
  };

  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
  };

  return (
    <div className="auth-modal">
      {isOpen && (
        <div className="auth-modal-content">
          <button className="close" onClick={onClose}>
            <img src="./icon-close.png" alt="close-action" />
          </button>
          <div className="title-container-auth">
            <h2 className="modal-title-auth">Авторизация</h2>
          </div>
          <div className="data-container">
            <div className="data-title-user">Логин</div>
            <div className="data-user">
              <input
                className="input-data-user"
                placeholder="ivanivanovich@example.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="data-title-user">Пароль</div>
            <div className="data-user">
              <input
                className="input-data-user"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="button-container">
            <button className="button-save" onClick={handleAuthClick}>
              Войти
            </button>
            <button className="button-register" onClick={handleRegisterClick}>
              Регистрация
            </button>
          </div>
        </div>
      )}
      {isRegisterOpen && (
        <ModalReg
          onClose={closeRegisterModal}
          onRegisterSuccess={(name, email, password) => onRegisterSuccess(name, email, password)}
        />
      )}
    </div>
  );
};

export default ModalAuth;