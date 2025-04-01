// pages/CartPage.js
import React from 'react'
import { CartContext } from '../contexts/CartContext'

export default function CartPage() {
  const { cartItems, removeFromCart } = React.useContext(CartContext)

  return (
    <div className="cart-page">
      <h2 className="cart-title">Корзина</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty-text">Корзина пуста</p>
      ) : (
        <div className="cart-container">
          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={`${item.productId}-${item.colorId}-${item.sizeId}`}
            >
              {/* Photo */}
              {item.image ? (
                <img src={item.image} alt={item.colorName} className="cart-item-img" />
              ) : (
                <div className="no-photo">Нет фото</div>
              )}

              <div className="cart-item-info">
                <p>
                  <strong>Товар:</strong> {item.productName}
                </p>
                <p>
                  <strong>Цвет:</strong> {item.colorName}
                </p>
                <p>
                  <strong>Размер:</strong> {item.sizeLabel}
                </p>
                <p>
                  <strong>Цена:</strong> {item.price}
                </p>
              </div>

              <button
                className="delete-button"
                onClick={() => removeFromCart(item)}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
