import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/layout/Footer';
import MovieCard from '../components/movies/MovieCard';
import moviesData from '../data/movies.json';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const query = searchParams.get('q') || '';

  // Extraire les genres uniques
  const genres = [...new Set(moviesData.map(movie => movie.genre))];

  useEffect(() => {
    if (query.length >= 2) {
      // Filtrer les films
      let filtered = moviesData.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase())
      );

      // Filtrer par genre
      if (selectedGenre !== 'all') {
        filtered = filtered.filter(movie => movie.genre === selectedGenre);
      }

      // Trier les résultats
      switch (sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'year':
          filtered.sort((a, b) => b.year - a.year);
          break;
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'price':
          filtered.sort((a, b) => a.price - b.price);
          break;
        default:
          // relevance - garder l'ordre par défaut
          break;
      }

      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, selectedGenre, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search');
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar movies={moviesData} />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              name="search"
              defaultValue={query}
              placeholder="Rechercher un film..."
              className="w-full px-6 py-4 pl-12 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
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
        </form>

        {/* Filtres et tri */}
        {query && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Filtres par genre */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedGenre === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Tous
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedGenre === genre
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
            >
              <option value="relevance">Pertinence</option>
              <option value="rating">Note</option>
              <option value="year">Année</option>
              <option value="title">Titre</option>
              <option value="price">Prix</option>
            </select>
          </div>
        )}

        {/* Résultats */}
        {query ? (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {results.length} résultat{results.length !== 1 ? 's' : ''} pour "{query}"
            </h1>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h2 className="text-xl font-semibold mb-4">Aucun résultat</h2>
                <p className="text-gray-400 mb-8">
                  Aucun film ne correspond à votre recherche.
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors"
                >
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </>
        ) : (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-4">Rechercher un film</h2>
            <p className="text-gray-400">
              Tapez au moins 2 caractères pour rechercher.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Search;
