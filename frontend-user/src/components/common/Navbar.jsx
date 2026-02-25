import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import SearchBar from "../movies/SearchBar";
import CartButton from "./CartButton";

function Navbar({ movies = [], onSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    // Ajouter l'écouteur
    window.addEventListener('scroll', handleScroll);

    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Nettoyage
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  // Fonction pour le style des liens actifs
  const getLinkClass = ({ isActive }) =>
    isActive
      ? 'text-primary font-bold'
      : 'text-gray-300 hover:text-white transition-colors';

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300
${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-primary text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                NETFLIX
              </h1>
            </Link>

            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <NavLink to="/" className={getLinkClass}>
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-rentals" className={getLinkClass}>
                  Mes locations
                </NavLink>
              </li>
            </ul>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <SearchBar movies={movies} onSearch={onSearch} />
            <CartButton />

            {/* User Avatar / Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 bg-primary rounded flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
                  title={user.name}
                >
                  <span className="text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded font-medium transition-colors"
              >
                Connexion
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
