import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import moviesData from '../data/movies.json';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simuler un chargement
    setLoading(true);

    const foundMovie = moviesData.find(m => m.id === parseInt(id));

    setTimeout(() => {
      setMovie(foundMovie);
      setLoading(false);
    }, 500);
  }, [id]);

  // Effacer la notification après 3 secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRent = () => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Créer la location
    const rental = {
      ...movie,
      rentalDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
    };

    // Récupérer les locations existantes
    const existingRentals = JSON.parse(localStorage.getItem('rentals') || '[]');

    // Vérifier si déjà loué
    const alreadyRented = existingRentals.some(r => r.id === movie.id);

    if (alreadyRented) {
      setNotification({ type: 'error', message: 'Vous avez déjà loué ce film' });
      return;
    }

    // Ajouter la nouvelle location
    const updatedRentals = [...existingRentals, rental];
    localStorage.setItem('rentals', JSON.stringify(updatedRentals));

    setNotification({ type: 'success', message: 'Film loué avec succès !' });

    // Rediriger vers MyRentals après 2 secondes
    setTimeout(() => {
      navigate('/my-rentals');
    }, 2000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du film...</p>
        </div>
      </div>
    );
  }

  // Film non trouvé
  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Film introuvable</h1>
          <p className="text-gray-400 mb-8">Ce film n'existe pas dans notre catalogue.</p>
          <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar movies={moviesData} />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-xl z-50 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Image de fond */}
      <div className="relative h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />

        {/* Bouton retour */}
        <button
          onClick={handleGoBack}
          className="absolute top-24 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 -mt-64 relative z-10">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Films', path: '/' },
            { label: movie.genre, path: `/?genre=${movie.genre}` },
            { label: movie.title }
          ]}
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl"
            />
          </div>

          {/* Informations */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-yellow-400 font-bold text-xl">
                {movie.rating}/10
              </span>
              <span className="text-gray-400">{movie.year}</span>
              <span className="text-gray-400">{movie.duration} min</span>
              <span className="px-3 py-1 bg-primary rounded-full text-sm">
                {movie.genre}
              </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {movie.description}
            </p>

            <Button size="lg" onClick={handleRent} className="mb-8">
              Louer pour {movie.price}€
            </Button>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Durée</span>
                <p className="font-medium">{movie.duration} minutes</p>
              </div>
              <div>
                <span className="text-gray-500">Année de sortie</span>
                <p className="font-medium">{movie.year}</p>
              </div>
              <div>
                <span className="text-gray-500">Genre</span>
                <p className="font-medium">{movie.genre}</p>
              </div>
              <div>
                <span className="text-gray-500">Note</span>
                <p className="font-medium">{movie.rating}/10</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

export default MovieDetail;
