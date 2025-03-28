// CartContext.js
import React, { createContext, useState } from "react";

// Создаем контекст корзины
export const CartContext = createContext();

export function CartProvider({ children }) {
  // Состояние корзины: массив объектов (товаров), каждый уникален (productId, colorId, sizeId)
  const [cartItems, setCartItems] = useState([]);

  // Добавление товара в корзину (если комбинация уже есть, не добавляем)
  const addToCart = (item) => {
    const exists = cartItems.some(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.colorId === item.colorId &&
        cartItem.sizeId === item.sizeId
    );
    if (!exists) {
      setCartItems((prevItems) => [...prevItems, item]);
    }
  };

  // Удаление товара из корзины
  const removeFromCart = (itemToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (cartItem) =>
          !(
            cartItem.productId === itemToRemove.productId &&
            cartItem.colorId === itemToRemove.colorId &&
            cartItem.sizeId === itemToRemove.sizeId
          )
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
