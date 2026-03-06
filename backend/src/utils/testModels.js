import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Rental from '../models/Rental.js';

dotenv.config();

const testModels = async () => {
  try {
    await connectDB();

    console.log('🧪 Tests des modèles...\n');

    // Test 1: Créer un utilisateur
    console.log('Test 1: Création d\'un utilisateur');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'test123'
    });
    console.log('✅ Utilisateur créé:', testUser.toJSON());
    console.log('   Avatar auto-généré:', testUser.avatar);

    // Test 2: Tester la méthode comparePassword
    console.log('\nTest 2: Comparaison de mot de passe');
    const userWithPassword = await User.findById(testUser._id).select('+password');
    const isMatch = await userWithPassword.comparePassword('test123');
    console.log('✅ Password match:', isMatch);

    // Test 3: Créer un film
    console.log('\nTest 3: Création d\'un film');
    const testMovie = await Movie.create({
      title: 'Test Movie',
      description: 'Un film de test pour valider le modèle Movie',
      poster: 'https://example.com/poster.jpg',
      backdrop: 'https://example.com/backdrop.jpg',
      genre: ['Action'],
      year: 2024,
      duration: 120,
      price: 4.99,
      rating: 7.5
    });
    console.log('✅ Film créé:', testMovie.title);
    console.log('   Durée formatée:', testMovie.durationFormatted);

    // Test 4: Créer une location
    console.log('\nTest 4: Création d\'une location');
    const testRental = await Rental.create({
      user: testUser._id,
      movie: testMovie._id,
      price: testMovie.price
    });
    console.log('✅ Location créée');
    console.log('   Jours restants:', testRental.daysLeft);
    console.log('   Est active:', testRental.isActive());

    // Test 5: Populate
    console.log('\nTest 5: Populate (relations)');
    const rentalWithDetails = await Rental.findById(testRental._id)
      .populate('user', 'name email')
      .populate('movie', 'title price');
    console.log('✅ Location avec détails:', {
      user: rentalWithDetails.user.name,
      movie: rentalWithDetails.movie.title,
      price: rentalWithDetails.price
    });

    // Test 6: Méthodes statiques
    console.log('\nTest 6: Méthodes statiques');
    const activeRentals = await Rental.getActiveRentals(testUser._id);
    console.log('✅ Locations actives:', activeRentals.length);

    // Test 7: Validation d'erreur (Exercice 2)
    console.log('\nTest 7: Test de validation des erreurs');
    try {
      await Movie.create({
        title: 'Film invalide',
        description: 'Test de validation',
        poster: 'https://example.com/poster.jpg',
        backdrop: 'https://example.com/backdrop.jpg',
        genre: ['Action'],
        year: 2024,
        duration: 600, // Trop long - devrait échouer
        price: 3.999 // Trop de décimales - devrait échouer
      });
    } catch (error) {
      console.log('✅ Validation échouée comme prévu:', error.message);
    }

    // Test 8: Méthodes statiques avancées (Exercice 3)
    console.log('\nTest 8: Méthodes statiques avancées');

    // Créer quelques films supplémentaires pour les tests
    await Movie.create([
      {
        title: 'Sci-Fi Movie 1',
        description: 'Un film de science-fiction',
        poster: 'https://example.com/poster1.jpg',
        backdrop: 'https://example.com/backdrop1.jpg',
        genre: ['Science-Fiction'],
        year: 2023,
        duration: 130,
        price: 3.50,
        rating: 8.0
      },
      {
        title: 'Sci-Fi Movie 2',
        description: 'Un autre film de science-fiction',
        poster: 'https://example.com/poster2.jpg',
        backdrop: 'https://example.com/backdrop2.jpg',
        genre: ['Science-Fiction', 'Action'],
        year: 2024,
        duration: 140,
        price: 4.50,
        rating: 7.8
      }
    ]);

    const sciFiMovies = await Movie.getByGenre("Science-Fiction");
    console.log("   Films Sci-Fi:", sciFiMovies.length);

    const affordableMovies = await Movie.getByPriceRange(0, 4);
    console.log("   Films à moins de 4€:", affordableMovies.length);

    const stats = await Movie.getStatsByGenre();
    console.log("   Statistiques par genre:", stats);

    // Nettoyage
    console.log('\n🧹 Nettoyage...');
    await User.deleteOne({ _id: testUser._id });
    await Movie.deleteMany({ title: { $in: ['Test Movie', 'Sci-Fi Movie 1', 'Sci-Fi Movie 2'] } });
    await Rental.deleteOne({ _id: testRental._id });

    console.log('\n🎉 Tous les tests sont passés!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

testModels();
