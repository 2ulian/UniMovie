import { useState } from 'react';
import { useCart } from '../../context/CartContext';

function CartButton() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, cartCount, total, removeFromCart } = useCart();

  // Fonction pour afficher/masquer le panier
  const toggleShow = () => {
    setShowCart(!showCart);
  };

  return (
    <div className="relative flex">
      <button
        onClick={toggleShow}
        className="relative hover:text-gray-300 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Dropdown du panier */}
      {showCart && (
        <div className="absolute right-0 mt-8 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
          <h3 className="text-lg font-bold mb-3">Mon panier</h3>

          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-sm">Votre panier est vide</p>
          ) : (
            <>
              {/* Liste des films */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((movie) => (
                  <div
                    key={movie.id}
                    onDoubleClick={() => removeFromCart(movie.id)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
                    title="Double-cliquez pour retirer"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{movie.title}</p>
                      <p className="text-primary text-sm">{movie.price}€</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 mt-3 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{total.toFixed(2)}€</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CartButton;
