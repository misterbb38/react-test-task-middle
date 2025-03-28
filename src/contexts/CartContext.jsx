// CartContext.js
import React, { createContext, useState } from "react";

// Создаем контекст корзины
export const CartContext = createContext();

export function CartProvider({ children }) {
  // Состояние, хранящее массив товаров, где каждый товар имеет уникальное сочетание (productId, colorId, sizeId)
  const [cartItems, setCartItems] = useState([]);

  // Функция для добавления товара в корзину
  // Товар добавляется, только если точно такого же (по productId, colorId, sizeId) в корзине еще нет
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

  // Функция для удаления товара из корзины
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
