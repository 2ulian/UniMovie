import Navbar from '../components/common/Navbar';
import MovieHero from '../components/movies/MovieHero';
import MovieList from '../components/movies/MovieList';
import Footer from '../components/layout/Footer';
import movies from '../data/movies.json';

function Home() {
  // Le premier film sera mis en avant
  const heroMovie = movies[0];

  // Films populaires : 5 films au hasard (triés par rating pour simuler la popularité)
  const popularMovies = [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Films Science-Fiction (genre choisi)
  const sciFiMovies = movies
    .filter((movie) => movie.genre === 'Science-Fiction')
    .slice(0, 5);

  // Films récents : sortis après 2010
  const recentMovies = movies
    .filter((movie) => movie.year > 2010)
    .slice(0, 6);

  // Films d'action
  const actionMovies = movies
    .filter((movie) => movie.genre === 'Action')
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Banner */}
      <MovieHero movie={heroMovie} />

      {/* Movie Lists */}
      <div className="relative z-10 -mt-32">
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
