import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page introuvable</h2>
        <p className="text-gray-400 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
