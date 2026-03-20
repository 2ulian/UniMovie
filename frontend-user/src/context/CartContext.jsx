import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Charger et initialiser le panier et les locations
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [rentals, setRentals] = useState(() => {
    const stored = localStorage.getItem('rentals');
    return stored ? JSON.parse(stored) : [];
  });

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sauvegarder les locations à chaque modification
  useEffect(() => {
    localStorage.setItem('rentals', JSON.stringify(rentals));
  }, [rentals]);

  // Ajouter au panier
  const addToCart = (movie) => {
    if (!cart.some(item => item.id === movie.id)) {
      setCart(prev => [...prev, movie]);
    }
  };

  // Retirer du panier
  const removeFromCart = (movieId) => {
    setCart(prev => prev.filter(item => item.id !== movieId));
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer le total
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  // Nombre d'items
  const getCartCount = () => {
    return cart.length;
  };

  // Louer un film
  const rentMovie = (movie) => {
    const rentalDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 jours

    const rental = {
      id: Date.now(),
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      price: movie.price,
      year: movie.year,
      genre: movie.genre,
      rentalDate: rentalDate.toISOString(),
      expiryDate: expiryDate.toISOString()
    };

    setRentals(prev => [...prev, rental]);
    removeFromCart(movie.id);

    return { success: true, rental };
  };

  // Louer tous les films du panier
  const rentAllInCart = () => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    const newRentals = cart.map(movie => ({
      id: Date.now() + Math.random(),
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      price: movie.price,
      year: movie.year,
      genre: movie.genre,
      rentalDate: now.toISOString(),
      expiryDate: expiry.toISOString()
    }));

    setRentals(prev => [...prev, ...newRentals]);
    clearCart();

    return { success: true, count: newRentals.length };
  };

  // Vérifier si un film est loué
  const isRented = (movieId) => {
    return rentals.some(r => r.movieId === movieId && new Date(r.expiryDate) > new Date());
  };

  // Obtenir la location d'un film
  const getRentalByMovieId = (movieId) => {
    return rentals.find(r => r.movieId === movieId);
  };

  // Vérifier si un film est dans le panier
  const isInCart = (movieId) => {
    return cart.some(item => item.id === movieId);
  };

  const value = {
    cart,
    rentals,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    rentMovie,
    rentAllInCart,
    isRented,
    getRentalByMovieId,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
