import React from 'react';
import '../static/head.css'

function Head() {
    return(
        <div>
            <div className="header">
                <img src='./logo.png' alt='logotype' className="logo" />
                <div className="navbar">
                    <div className="nav-list">
                        <a href='home' className="nav-item">Поставки</a>
                        <a href='home' className="nav-item">Товары</a>
                        <a href='home' className="nav-item">Цены и скидки</a>
                        <a href='home' className="nav-item">Аналитика</a>
                        <a href='home' className="nav-item">Реклама</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Head