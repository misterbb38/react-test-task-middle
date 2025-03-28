import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// Страницы
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'

// Контекст корзины
import { CartContext } from './contexts/CartContext'

// Внутри кода, текст и комментарии en russe
export default function App() {
  // Получаем cartItems из контекста, чтобы отобразить их количество
  const { cartItems } = React.useContext(CartContext)

  return (
    <Router>
      {/* Шапка сайта с навигацией */}
      <header style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Главная</Link>
          <Link to="/cart">Корзина ({cartItems.length})</Link>
        </nav>
      </header>

      {/* Основной контент, маршруты */}
      <main>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </Router>
  )
}
