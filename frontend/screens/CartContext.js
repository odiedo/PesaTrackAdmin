import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const resetCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, resetCart }}>
      {children}
    </CartContext.Provider>
  );
};
