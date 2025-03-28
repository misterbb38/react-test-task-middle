import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { CartProvider } from './contexts/CartContext'

import './styles/index.css'

// Точка входа. Подключаем провайдер корзины и рендерим App.
const rootElement = document.getElementById('root')
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <CartProvider>
        <App />
      </CartProvider>
    </React.StrictMode>
  )
}
