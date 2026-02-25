import { useState, useEffect } from 'react';

function SearchBar({ movies, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      // Filtrer les films en fonction du titre et la description
      const filtered = movies
        .filter(movie =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5); // Limiter à 5 films

      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchTerm, movies]);

  const handleSelect = (movie) => {
    setSearchTerm(movie.title);
    setIsOpen(false);
    // Action lors de la sélection
    if (onSearch) {
      onSearch(movie);
    }
  };

  const handleFocus = () => {
    // Quand la zone de recherche reçoit le focus, si elle comporte au moins 2 caractères
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder="Rechercher un film..."
          className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
        />
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Dropdown de suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleSelect(movie)}
              className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-10 h-14 object-cover rounded"
              />
              <div>
                <p className="font-medium text-white">{movie.title}</p>
                <p className="text-sm text-gray-400">
                  {movie.year} • {movie.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
