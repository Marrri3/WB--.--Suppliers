import React, { useState, useEffect, useRef } from 'react';
import '../static/catalog.css';
import ModalAdd from './modalAdd';
import { createOrder } from '../api/requests/OrderdRequests';
import { filterOptions } from '../utils/filtersData'; 
import { NewOrder } from '../utils/types'; 

interface CatalogProps {
  isAuthenticated: boolean;
  onOrderCreated: () => void;
  setSortBy: (value: string) => void;
  setSearchValue: (value: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ isAuthenticated, onOrderCreated, setSortBy, setSearchValue }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOption, setSortOption] = useState('По номеру'); 
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  //обработчики
  const handleToggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleSelectSort = (value: string) => {
    setSortOption(value);
    setIsMenuOpen(false);
    setSortBy(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearchValue(value);
  };

  const handleAddClick = () => setModalOpen(true);

  const closeModal = () => setModalOpen(false);

  const handleOrderCreated = async (newOrder: NewOrder) => {
    try {
      await createOrder(newOrder);
      alert('Поставка успешно добавлена!');
      onOrderCreated();
      closeModal();
    } catch (error) {
      console.error('Ошибка при добавлении поставки:', error);
      alert('Не удалось добавить поставку. Попробуйте снова.');
    }
  };

  //эффект для закрытия меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="catalog">
      <h1 className="title">Поставки</h1>
      <div className="right-catalog">
        {isAuthenticated && (
          <button className="container-button" onClick={handleAddClick}>
            <img src="./icon-plus.png" alt="add" className="add-icon" />
            <span className="catalog-title">Добавить поставку</span>
          </button>
        )}
        <div className="filter-container">
          <div className="filter-box">
            <span className="filter-label no-wrap">{sortOption}</span>
            <button className="button-icon-catalog" onClick={handleToggleMenu}>
              <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon" />
            </button>
          </div>
          {isMenuOpen && (
            <div className="catalog-dropdown-menu" ref={menuRef}>
              <ul>
                {filterOptions.map(option => (
                  <li key={option.id} onClick={() => handleSelectSort(option.label)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Поиск.."
            className="search-input"
          />
          <button className="button-icon-catalog">
            <img src="./icon-search.png" alt="search" className="search-icon" />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ModalAdd isOpen={isModalOpen} onClose={closeModal} addOrder={handleOrderCreated} />
      )}
    </div>
  );
};

export default Catalog;