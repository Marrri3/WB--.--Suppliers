import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Импортируем App вместо отдельных компонентов
import reportWebVitals from './reportWebVitals';

const home = ReactDOM.createRoot(
  document.getElementById('home') as HTMLElement
);
home.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();