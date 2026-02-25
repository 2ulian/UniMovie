import { useState } from 'react';

function MovieDescription({ description }) {
  // Variable d'état pour savoir si la description est étendue ou non
  const [isExpanded, setIsExpanded] = useState(false);

  // Fonction pour basculer l'état
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p className={isExpanded ? '' : 'line-clamp-2'}>
        {description}
      </p>
      <button
        onClick={toggleExpanded}
        className="text-primary hover:text-primary-dark mt-2 text-sm font-medium transition-colors"
      >
        {isExpanded ? 'Voir moins' : 'Voir plus'}
      </button>
    </div>
  );
}

export default MovieDescription;
