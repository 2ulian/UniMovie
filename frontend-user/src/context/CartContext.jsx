import { createContext, useContext, useState } from 'react';

// Créer le contexte
const CartContext = createContext();

// Provider du panier
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter un film au panier
  const addToCart = (movie) => {
    const isAlreadyInCart = cartItems.some(item => item.id === movie.id);
    if (!isAlreadyInCart) {
      setCartItems([...cartItems, movie]);
    }
  };

  // Retirer un film du panier
  const removeFromCart = (movieId) => {
    setCartItems(cartItems.filter(item => item.id !== movieId));
  };

  // Nombre d'articles
  const cartCount = cartItems.length;

  // Total du panier
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      total,
      addToCart,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personnalisé pour utiliser le panier
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
}
