// CartContext.js
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    // Vérifie si l'article est déjà dans le panier
    const exists = cartItems.some(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.colorId === item.colorId &&
        cartItem.sizeId === item.sizeId
    );

    if (exists) {
      // Si déjà présent, on affiche une boîte de confirmation (confirm)
      const userConfirmed = window.confirm(
        "Этот товар уже есть в корзине. Добавить ещё раз?"
      );
      if (userConfirmed) {
        // Si l'utilisateur dit oui, on l'ajoute quand même
        setCartItems((prevItems) => [...prevItems, item]);
      }
    } else {
      // Sinon, on l'ajoute directement
      setCartItems((prevItems) => [...prevItems, item]);
    }
  };

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
