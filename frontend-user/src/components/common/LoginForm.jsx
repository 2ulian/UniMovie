import { useState } from 'react';

function LoginForm() {
  // Variable d'état pour stocker email et password dans un objet
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // Fonction appelée à la modification du mail ou du mot de passe
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Créer un nouvel objet avec le spread operator
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // Fonction appelée à la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Credentials:', credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Connexion</h2>

      <input
        type="email"
        name="email"
        value={credentials.email}
        onChange={handleChange}
        placeholder="Email"
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
      />

      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleChange}
        placeholder="Mot de passe"
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
      />

      <button
        type="submit"
        className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-white font-semibold"
      >
        Valider
      </button>
    </form>
  );
}

export default LoginForm;
