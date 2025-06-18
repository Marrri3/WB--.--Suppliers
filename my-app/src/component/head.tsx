import React, { useState, useEffect, useRef } from 'react';
import { User } from '../utils/types';
import ModalAuth from './modalAuth';
import ModalUserEdit from './modalUserEdit';
import { loginUser, registerUser, getMe, editMe } from '../api/requests/UsersRequests';
import '../static/head.css';

interface HeadProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Head: React.FC<HeadProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Обработчики
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuthClick = () => setAuthModalOpen(true);

  const closeAuthModal = () => setAuthModalOpen(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      await fetchUserData();
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка входа. Проверьте email и пароль.');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await registerUser(name, email, password);
      alert('Регистрация прошла успешно! Пожалуйста, войдите в аккаунт.');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Ошибка регистрации. Проверьте данные или попробуйте снова.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setVisibleMenuId(null);
  };

  const fetchUserData = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      handleSessionExpired(error);
    }
  };

  const handleEditUser = async (updatedData: Partial<User>) => {
    try {
      const response = await editMe(updatedData.email || '', updatedData.name || '');
      setUser(response);
      setEditModalOpen(false);
    } catch (error) {
      handleSessionExpired(error);
    }
  };

  const handleSessionExpired = (error: any) => {
    if (error instanceof Response && error.status === 401) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      alert('Сессия истекла. Пожалуйста, войдите снова.');
    } else {
      alert('Произошла ошибка.');
    }
  };

  //эффекты
  useEffect(() => {
    const checkTokenOnMount = async () => {
      if (isAuthenticated) {
        try {
          await fetchUserData();
        } catch (error) {
          handleSessionExpired(error);
        }
      }
    };
    checkTokenOnMount();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && visibleMenuId === 1) {
        setVisibleMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visibleMenuId]);

  return (
    <div className="head">
      <div className="header">
        <img src="./logo.png" alt="logotype" className="logo" />
        <div className={`navbar ${isMenuOpen ? 'show' : ''}`}>
          <div className="nav-list">
            <a href="#home" className="nav-item">Главная</a>
            <a href="#shipments" className="nav-item">Поставки</a>
            <a href="#products" className="nav-item">Товары</a>
          </div>
        </div>
        <div className="right-profile">
          {!isAuthenticated ? (
            <button className="container-button-user" onClick={handleAuthClick}>
              <div className="nav-item-user">Войти</div>
            </button>
          ) : (
            <div className="user" style={{ position: 'relative' }}>
              <div
                className="entry-dropdown-title"
                onClick={() => { setVisibleMenuId(visibleMenuId === 1 ? null : 1); }}
              >
                {user?.name || 'Пользователь'}
              </div>
              {visibleMenuId === 1 && (
                <div className="head-dropdown-menu" ref={menuRef} style={{ top: '100%', left: 0 }}>
                  <ul>
                    <li onClick={() => { setEditModalOpen(true); setVisibleMenuId(null); }}>Изменить</li>
                    <li onClick={() => { handleLogout(); setVisibleMenuId(null); }}>Выйти</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="icon-buttons">
          <div className="left-icon-buttons">
            <button className="hamburger" onClick={toggleMenu}>
              <img src="./icon-menu.png" alt="Меню" />
            </button>
          </div>
          <div className="right-icon-buttons">
            <button className="right-icon">
              <img src="./icon-doc.png" alt="Документ" />
            </button>
            <button className="right-icon">
              <img src="./icon-log.png" alt="Лог" />
            </button>
          </div>
        </div>
      </div>
      {isAuthModalOpen && (
        <ModalAuth
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onLoginSuccess={handleLogin}
          onRegisterSuccess={handleRegister}
        />
      )}
      {isEditModalOpen && user && (
        <ModalUserEdit
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditUser}
          initialData={user}
        />
      )}
    </div>
  );
};

export default Head;