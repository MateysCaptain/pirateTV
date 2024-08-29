import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import { BrowserRouter } from "react-router-dom";
import { GlobalStyles } from './global-styles';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename="/">
      <GlobalStyles />
        <App />
    </BrowserRouter>
);
