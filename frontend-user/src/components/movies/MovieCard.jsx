import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import MovieDescription from './MovieDescription';
import { useCart } from '../../context/CartContext';

// Couleurs par genre
const genreColors = {
  'Action': 'bg-red-500',
  'Comédie': 'bg-yellow-500',
  'Drame': 'bg-blue-500',
  'Science-Fiction': 'bg-purple-500',
  'Horreur': 'bg-orange-500',
  'Thriller': 'bg-gray-500'
};

function MovieCard({ movie }) {
  const genreColor = genreColors[movie.genre] || 'bg-gray-500';
  const { addToCart } = useCart();

  // Variables d'état pour le système de likes
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fonction pour liker/unliker le film
  const handleLike = (e) => {
    e.preventDefault(); // Empêcher le comportement par défaut
    e.stopPropagation(); // Empêcher la propagation vers le Link parent

    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  // Fonction pour louer le film
  const handleRent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(movie);
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105">
        {/* Image principale */}
        <div className="relative aspect-[2/3]">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />

          {/* Badge de note */}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded">
            <span className="text-yellow-400 font-bold text-sm">
              {movie.rating}
            </span>
          </div>

          {/* Badge de genre */}
          <div className={`absolute bottom-2 left-2 ${genreColor} px-2 py-1 rounded text-xs font-semibold`}>
            {movie.genre}
          </div>
        </div>

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold mb-2">{movie.title}</h3>

          <div className="flex items-center space-x-3 mb-3 text-sm">
            <span className="text-green-400 font-semibold">{movie.rating}/10</span>
            <span className="text-gray-400">{movie.year}</span>
            <span className="text-gray-400">{movie.duration}min</span>
          </div>

          {/* Bouton Like */}
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded mb-3 transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-gray-500 text-white hover:bg-gray-400'
            }`}
          >
            {isLiked ? '❤' : '🤍'} {likes} likes
          </button>

          <div className="text-sm text-gray-300 mb-4">
            <MovieDescription description={movie.description} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm" className="flex-1" onClick={handleRent}>
              Louer {movie.price}€
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              + Info
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
