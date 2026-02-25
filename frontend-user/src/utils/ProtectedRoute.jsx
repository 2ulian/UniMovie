import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Vérifier si l'utilisateur est connecté via localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
