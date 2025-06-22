import React, { useState } from 'react';
import '../static/modalReg.css';

interface ModalProps {
  onClose: () => void;
  onRegisterSuccess: (name: string, email: string, password: string) => void;
}

const ModalReg: React.FC<ModalProps> = ({ onClose, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Функция проверки пароля
  const validatePassword = (pass: string) => {
    const forbiddenChars = /[*&{}|_+]/;
    if (pass.length < 4 || pass.length > 16) {
      alert('Длина пароля должна быть от 4 до 16 символов');
      return false;
    }
    if (forbiddenChars.test(pass)) {
      alert('Пароль содержит запрещенные символы: *, &, {, }, |, +');
      return false;
    }
    if (!/[A-Z]/.test(pass)) {
      alert('Пароль должен содержать хотя бы одну заглавную букву');
      return false;
    }
    if (!/[a-z]/.test(pass)) {
      alert('Пароль должен содержать хотя бы одну строчную букву');
      return false;
    }
    if (!/\d/.test(pass)) {
      alert('Пароль должен содержать хотя бы одну цифру');
      return false;
    }
    return true;
  };

  // Функция проверки email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Введите корректный email адрес');
      return false;
    }
    return true;
  };

  // Проверка полей и регистрация пользователя
  const handleRegistrClick = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('Все поля обязательны');
      return;
    }
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    if (!validatePassword(password)) {
      return;
    }
    if (!validateEmail(email)) {
      return;
    }
    try {
      onRegisterSuccess(name, email, password);
      setError(null);
      onClose();
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте ещё раз.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="reg-modal">
      <div className="reg-modal-content">
        <button className="close" onClick={onClose}>
          <img src="./icon-close.png" alt="close-action" />
        </button>
        <div className="title-container-reg">
          <h2 className="modal-title-reg">Регистрация</h2>
        </div>
        <div className="data-container">
          <div className="data-title-reg">Имя</div>
          <div className="data-reg">
            <input
              className="input-data-reg"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="data-title-reg">Почта</div>
          <div className="data-reg">
            <input
              className="input-data-reg"
              placeholder="ivanivanovich@example.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="data-title-reg">Пароль</div>
          <div className="data-reg">
            <input
              className="input-data-reg"
              placeholder="Введите пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="data-title-reg">Повторите пароль</div>
          <div className="data-reg">
            <input
              className="input-data-reg"
              placeholder="Введите пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="button-container">
          <button className="button-save-reg" onClick={handleRegistrClick}>Зарегистрироваться</button>
        </div>
      </div>
    </div>
  );
};

export default ModalReg;