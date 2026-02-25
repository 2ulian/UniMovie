import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/layout/Footer';
import RentalCountdown from '../components/movies/RentalCountdown';

function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Récupérer les locations
    const storedRentals = localStorage.getItem('rentals');
    if (storedRentals) {
      setRentals(JSON.parse(storedRentals));
    }
  }, []);

  // Supprimer une location
  const handleRemoveRental = (movieId) => {
    const updatedRentals = rentals.filter(rental => rental.id !== movieId);
    setRentals(updatedRentals);
    localStorage.setItem('rentals', JSON.stringify(updatedRentals));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8">Mes locations</h1>

        {user && (
          <p className="text-gray-400 mb-8">
            Bonjour, <span className="text-white font-medium">{user.name}</span>
          </p>
        )}

        {rentals.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-4">Aucune location</h2>
            <p className="text-gray-400 mb-8">
              Vous n'avez pas encore loué de films.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors"
            >
              Découvrir les films
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-gray-900 rounded-lg overflow-hidden flex"
              >
                {/* Poster */}
                <Link to={`/movie/${rental.id}`} className="flex-shrink-0">
                  <img
                    src={rental.poster}
                    alt={rental.title}
                    className="w-32 h-48 object-cover hover:opacity-80 transition-opacity"
                  />
                </Link>

                {/* Infos */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/movie/${rental.id}`}
                      className="font-bold text-lg hover:text-primary transition-colors"
                    >
                      {rental.title}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1">
                      {rental.year} • {rental.genre}
                    </p>
                    <div className="mt-3">
                      <RentalCountdown expiryDate={rental.expiryDate} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-primary font-semibold">
                      {rental.price}€
                    </span>
                    <button
                      onClick={() => handleRemoveRental(rental.id)}
                      className="text-red-500 hover:text-red-400 text-sm transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyRentals;
