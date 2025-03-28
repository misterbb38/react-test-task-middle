// App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// Импорт страниц
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'

// Контекст корзины (для отображения количества в шапке)
import { CartContext } from './contexts/CartContext'

export default function App() {
  // Достаем список товаров из корзины
  const { cartItems } = React.useContext(CartContext)

  return (
    <Router>
      {/* Шапка */}
      <header className="app-header">
        <nav className="nav-bar">
          <Link to="/" className="nav-link">
            Главная
          </Link>
          <Link to="/cart" className="nav-link">
            Корзина ({cartItems.length})
          </Link>
        </nav>
      </header>

      {/* Главный контент */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </Router>
  )
}
