import React, { useState } from 'react';
import '../static/head.css';

function Head() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <div className="header">
                <img src='./logo.png' alt='logotype' className="logo" />
                <div className={`navbar ${isMenuOpen ? 'show' : ''}`}>
                    <div className="nav-list">
                        <a href='home' className="nav-item">Поставки</a>
                        <a href='home' className="nav-item">Товары</a>
                        <a href='home' className="nav-item">Цены и скидки</a>
                        <a href='home' className="nav-item">Аналитика</a>
                        <a href='home' className="nav-item">Реклама</a>
                    </div>
                </div>
                <div className='icon-buttons'>
                    <div className="left-icon-buttons">
                        <button className="hamburger" onClick={toggleMenu}>
                            <img src='./icon-menu.png' alt='Меню' />
                        </button>
                    </div>
                    <div className="right-icon-buttons">
                        <button className='right-icon'>
                            <img src='./icon-doc.png' alt='Документ' />
                        </button>
                        <button className='right-icon'>
                            <img src='./icon-log.png' alt='Лог' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Head;