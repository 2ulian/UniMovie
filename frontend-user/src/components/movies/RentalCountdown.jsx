import { useState, useEffect } from 'react';

function RentalCountdown({ expiryDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(expiryDate) - new Date();

      if (diff <= 0) {
        setTimeLeft('Expiré');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days}j ${hours}h ${minutes}m`);
    };

    // Calculer immédiatement
    calculateTimeLeft();

    // Mettre à jour chaque minute
    const interval = setInterval(calculateTimeLeft, 60000);

    // Nettoyage
    return () => clearInterval(interval);
  }, [expiryDate]);

  return (
    <span className="text-yellow-400 font-medium">
      Expire dans: {timeLeft}
    </span>
  );
}

export default RentalCountdown;
