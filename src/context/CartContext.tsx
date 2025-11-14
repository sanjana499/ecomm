"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: any) {
  const [cartCount, setCartCount] = useState(0);

  // Load count initial
  useEffect(() => {
    fetch("/api/cart/count")
      .then(res => res.json())
      .then(data => setCartCount(data.count || 0))
      .catch(() => {});
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
