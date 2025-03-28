// pages/CartPage.js
import React from 'react'
import { CartContext } from '../contexts/CartContext'

// Текст/ком en russe
export default function CartPage() {
  // Достаем cartItems и removeFromCart из контекста
  const { cartItems, removeFromCart } = React.useContext(CartContext)

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Корзина</h2>

      {cartItems.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.colorId}-${item.sizeId}`}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <p>
              Товар: {item.productName}
              <br />
              Цвет: {item.colorName}
              <br />
              Размер: {item.sizeId}
            </p>
            <p>Цена: {item.price}</p>
            <button onClick={() => removeFromCart(item)}>Удалить</button>
          </div>
        ))
      )}
    </div>
  )
}
