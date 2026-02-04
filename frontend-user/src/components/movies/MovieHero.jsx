import Button from '../common/Button';

function MovieHero({ movie }) {
  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Meta information */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <span className="bg-primary px-3 py-1 rounded text-sm font-bold">
              {movie.rating}/10
            </span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-300">{movie.duration} min</span>
            <span className="border border-gray-500 px-2 py-0.5 text-sm rounded">
              {movie.genre}
            </span>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed drop-shadow-lg">
            {movie.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="shadow-2xl">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Louer pour {movie.price}
            </Button>
            <Button variant="secondary" size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Plus d'infos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieHero;
