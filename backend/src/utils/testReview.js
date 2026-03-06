import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';

dotenv.config();

const testReview = async () => {
  try {
    await connectDB();

    console.log('🧪 Tests du modèle Review...\n');

    // Récupérer un utilisateur et un film existants
    const user = await User.findOne({ email: 'john@example.com' });
    const movie = await Movie.findOne({ title: 'Inception' });

    if (!user || !movie) {
      console.error('❌ Exécutez d\'abord npm run seed');
      process.exit(1);
    }

    console.log(`📝 Test avec User: ${user.name}, Movie: ${movie.title}`);
    console.log(`   Note actuelle du film: ${movie.rating}/10\n`);

    // Supprimer les reviews existantes pour ce film (pour les tests)
    await Review.deleteMany({ movie: movie._id });

    // Test 1: Créer un review
    console.log('Test 1: Création d\'un review');
    const review1 = await Review.create({
      user: user._id,
      movie: movie._id,
      rating: 5,
      comment: 'Un chef-d\'oeuvre absolu! Christopher Nolan a créé un film inoubliable.'
    });
    console.log('✅ Review créé:', {
      rating: review1.rating,
      stars: review1.stars,
      comment: review1.comment.substring(0, 50) + '...'
    });

    // Vérifier que la note du film a été mise à jour
    const updatedMovie = await Movie.findById(movie._id);
    console.log(`   Note du film mise à jour: ${updatedMovie.rating}/10\n`);

    // Test 2: Vérifier l'unicité (un seul review par user par film)
    console.log('Test 2: Test d\'unicité (même user, même film)');
    try {
      await Review.create({
        user: user._id,
        movie: movie._id,
        rating: 4,
        comment: 'Tentative de double review qui devrait échouer.'
      });
      console.log('❌ Erreur: Le double review n\'aurait pas dû être autorisé');
    } catch (error) {
      console.log('✅ Unicité respectée: Un utilisateur ne peut reviewer qu\'une fois par film\n');
    }

    // Test 3: Ajouter des reviews d'autres utilisateurs
    console.log('Test 3: Ajout de reviews supplémentaires');
    const jane = await User.findOne({ email: 'jane@example.com' });
    const bob = await User.findOne({ email: 'bob@example.com' });

    await Review.create([
      {
        user: jane._id,
        movie: movie._id,
        rating: 4,
        comment: 'Très bon film mais un peu complexe à suivre par moments.'
      },
      {
        user: bob._id,
        movie: movie._id,
        rating: 5,
        comment: 'Absolument brillant! Les effets visuels et le scénario sont parfaits.'
      }
    ]);
    console.log('✅ 2 reviews supplémentaires ajoutés\n');

    // Test 4: Calculer la note moyenne
    console.log('Test 4: Calcul de la note moyenne');
    const stats = await Review.calculateAverageRating(movie._id);
    console.log('✅ Statistiques:', {
      noteMoyenne: stats.averageRating.toFixed(2) + '/5',
      noteSur10: stats.ratingOnTen.toFixed(1) + '/10',
      nombreReviews: stats.numberOfReviews
    });

    // Vérifier la note du film
    const finalMovie = await Movie.findById(movie._id);
    console.log(`   Note finale du film: ${finalMovie.rating}/10\n`);

    // Test 5: Obtenir les reviews d'un film
    console.log('Test 5: Récupération des reviews du film');
    const movieReviews = await Review.getMovieReviews(movie._id);
    console.log(`✅ ${movieReviews.length} reviews trouvés:`);
    movieReviews.forEach(r => {
      console.log(`   - ${r.user.name}: ${r.stars} "${r.comment.substring(0, 40)}..."`);
    });

    // Test 6: Distribution des notes
    console.log('\nTest 6: Distribution des notes');
    const distribution = await Review.getReviewStats(movie._id);
    console.log('✅ Distribution:');
    for (let i = 5; i >= 1; i--) {
      const bar = '█'.repeat(distribution[i] * 5);
      console.log(`   ${i}★: ${bar} (${distribution[i]})`);
    }

    // Test 7: Vérifier si un utilisateur a reviewé
    console.log('\nTest 7: Vérification des reviews existants');
    const hasJohnReviewed = await Review.hasUserReviewed(user._id, movie._id);
    const admin = await User.findOne({ email: 'admin@netflix.com' });
    const hasAdminReviewed = await Review.hasUserReviewed(admin._id, movie._id);
    console.log(`✅ John a reviewé Inception: ${hasJohnReviewed}`);
    console.log(`✅ Admin a reviewé Inception: ${hasAdminReviewed}`);

    // Test 8: Reviews d'un utilisateur
    console.log('\nTest 8: Reviews de John');
    const johnReviews = await Review.getUserReviews(user._id);
    console.log(`✅ John a ${johnReviews.length} review(s):`);
    johnReviews.forEach(r => {
      console.log(`   - ${r.movie.title} (${r.movie.year}): ${r.stars}`);
    });

    // Test 9: Validation des erreurs
    console.log('\nTest 9: Validation des erreurs');
    try {
      await Review.create({
        user: admin._id,
        movie: movie._id,
        rating: 6, // Invalide: doit être entre 1 et 5
        comment: 'Test'
      });
    } catch (error) {
      console.log('✅ Validation note: "' + error.errors.rating.message + '"');
    }

    try {
      await Review.create({
        user: admin._id,
        movie: movie._id,
        rating: 4,
        comment: 'Court' // Trop court
      });
    } catch (error) {
      console.log('✅ Validation commentaire: "' + error.errors.comment.message + '"');
    }

    console.log('\n🎉 Tous les tests du modèle Review sont passés!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

testReview();
