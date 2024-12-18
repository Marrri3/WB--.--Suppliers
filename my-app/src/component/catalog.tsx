import React, { useState, useEffect, useRef } from 'react';
import '../static/catalog.css';
import ModalAdd from './modalAdd';
import { addOrder } from '../api/requests/OrderdRequests'


const filterOptions = [
    { id: 1, label: 'По номеру' },
    { id: 2, label: 'По городу' },
    { id: 3, label: 'По типу поставки' },
    { id: 4, label: 'По статусу' },
];

const Catalog: React.FC = () => {
    const [visibleMenuId, setVisibleMenuId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleClick = (id: number) => {
        // Переключаем видимость меню
        setVisibleMenuId(prevId => (prevId === id ? null : id));
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setVisibleMenuId(null); // Закрываем выпадающий список
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        if (inputValue === '') {
            setIsInputFocused(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value !== '') {
            setIsInputFocused(true);
        }
    };

    const handleAddClick = () => {
        setModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setModalOpen(false); // Закрываем модальное окно
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setVisibleMenuId(null); // Закрываем меню при клике вне
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="catalog">
            <h1 className="title">Поставки</h1>
            <div className="right-catalog"> 
                <button className="container-button" onClick={() => handleAddClick()}>
                    <img src="./icon-plus.png" alt="add" className="add-icon"/>
                    <div className="catalog-title">Добавить поставку</div>
                </button>
                <div className="filter-container">
                    <div className="filter-box">
                        <div className="filter-label no-wrap">{selectedValue || 'По номеру'}</div>
                        <button className='button-icon-catalog' onClick={() => handleClick(1)}>
                            <img src="./icon-dropdown.png" alt="dropdown" className="dropdown-icon"/>
                        </button>  
                    </div>
                    {visibleMenuId === 1 && (
                        <div className='catalog-dropdown-menu' ref={menuRef}>
                            <ul>
                                {filterOptions.map(option => (
                                    <li key={option.id} onClick={() => handleSelect(option.label)}>
                                        {option.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <input 
                        type="text" 
                        value={inputValue} 
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={handleInputChange}
                        placeholder={isInputFocused || inputValue ? '' : 'Поиск..'}
                        className="search-input"
                    />
                    <button className='button-icon-catalog'>
                        <img src="./icon-search.png" alt="search" className="search-icon"/>
                    </button>             
                </div>
            </div>
            {isModalOpen && ( 
                <ModalAdd 
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    addOrder={addOrder}// Передача функции обновления заказов
                />
                )}
        </div>
    );
};

export default Catalog;