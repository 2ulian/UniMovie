import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import MovieHero from '../components/movies/MovieHero';
import MovieList from '../components/movies/MovieList';
import MovieFilter from '../components/movies/MovieFilter';
import Footer from '../components/layout/Footer';
import moviesData from '../data/movies.json';

function Home() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les films avec useEffect (simulation async)
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);

      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAllMovies(moviesData);
      setFilteredMovies(moviesData);
      setLoading(false);
    };

    loadMovies();
  }, []);

  // Gestion de la recherche depuis la navbar
  const handleSearch = (movie) => {
    console.log('Film sélectionné:', movie);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des films...</p>
        </div>
      </div>
    );
  }

  // Le premier film sera mis en avant
  const heroMovie = allMovies[0];

  // Films populaires : triés par rating
  const popularMovies = [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Films Science-Fiction
  const sciFiMovies = allMovies
    .filter((movie) => movie.genre === 'Science-Fiction')
    .slice(0, 5);

  // Films récents : sortis après 2010
  const recentMovies = allMovies
    .filter((movie) => movie.year > 2010)
    .slice(0, 6);

  // Films d'action
  const actionMovies = allMovies
    .filter((movie) => movie.genre === 'Action')
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar movies={allMovies} onSearch={handleSearch} />

      {/* Hero Banner */}
      <MovieHero movie={heroMovie} />

      {/* Movie Lists */}
      <div className="relative z-10 -mt-32">
        {/* Filtre par genre */}
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold px-4 mb-4">Filtrer par genre</h2>
          <MovieFilter
            movies={allMovies}
            onFilter={setFilteredMovies}
          />
          <MovieList
            title="Films disponibles"
            movies={filteredMovies}
          />
        </div>

        {/* Autres catégories */}
        <MovieList title="Films populaires" movies={popularMovies} />
        <MovieList title="Science-Fiction" movies={sciFiMovies} />
        <MovieList title="Films récents" movies={recentMovies} />
        <MovieList title="Action" movies={actionMovies} />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
