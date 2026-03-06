import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Rental from '../models/Rental.js';
import Review from '../models/Review.js';

// Configuration pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '../../.env') });

// Charger les données de films
const moviesPath = join(__dirname, '../../../data/movies.json');
const moviesData = JSON.parse(readFileSync(moviesPath, 'utf-8'));

const seedDatabase = async () => {
  try {
    // Connexion à la base de données
    await connectDB();

    console.log('🗑️ Nettoyage de la base de données...');

    // Supprimer toutes les données existantes
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Rental.deleteMany({});
    await Review.deleteMany({});

    console.log('✅ Base de données nettoyée');

    // Créer un utilisateur admin
    console.log('👤 Création de l\'utilisateur admin...');
    const admin = await User.create({
      name: 'Admin Netflix',
      email: 'admin@netflix.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`✅ Admin créé: ${admin.email}`);

    // Créer des utilisateurs de test
    console.log('👥 Création des utilisateurs de test...');
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
      },
      {
        name: 'Bob Martin',
        email: 'bob@example.com',
        password: 'password123'
      }
    ]);
    console.log(`✅ ${users.length} utilisateurs créés`);

    // Insérer les films
    console.log('🎬 Insertion des films...');
    const movies = await Movie.insertMany(moviesData);
    console.log(`✅ ${movies.length} films insérés`);

    // Créer quelques locations de test
    console.log('📦 Création de locations de test...');
    const rentals = await Rental.create([
      {
        user: users[0]._id,
        movie: movies[0]._id,
        price: movies[0].price,
        rentalDate: new Date(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[0]._id,
        movie: movies[1]._id,
        price: movies[1].price,
        rentalDate: new Date(),
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        user: users[1]._id,
        movie: movies[2]._id,
        price: movies[2].price,
        rentalDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'expired'
      }
    ]);
    console.log(`✅ ${rentals.length} locations créées`);

    // Mettre à jour le compteur de location des films
    await movies[0].incrementRentalCount();
    await movies[1].incrementRentalCount();
    await movies[2].incrementRentalCount();

    // Créer des reviews de test
    console.log('⭐ Création de reviews de test...');
    const reviews = await Review.create([
      {
        user: users[0]._id,
        movie: movies[0]._id, // Inception
        rating: 5,
        comment: 'Un chef-d\'oeuvre absolu! Christopher Nolan a créé un film inoubliable avec des concepts révolutionnaires.'
      },
      {
        user: users[1]._id,
        movie: movies[0]._id, // Inception
        rating: 4,
        comment: 'Très bon film, visuellement impressionnant mais parfois un peu complexe à suivre.'
      },
      {
        user: users[2]._id,
        movie: movies[0]._id, // Inception
        rating: 5,
        comment: 'Brillant! Le scénario et les effets spéciaux sont parfaitement maîtrisés.'
      },
      {
        user: users[0]._id,
        movie: movies[1]._id, // The Dark Knight
        rating: 5,
        comment: 'Heath Ledger est incroyable dans le rôle du Joker. Un film de super-héros qui transcende le genre.'
      },
      {
        user: users[1]._id,
        movie: movies[1]._id, // The Dark Knight
        rating: 5,
        comment: 'Le meilleur film Batman jamais réalisé. Une performance inoubliable.'
      },
      {
        user: users[0]._id,
        movie: movies[2]._id, // Interstellar
        rating: 5,
        comment: 'Une expérience cinématographique unique. La bande-son de Hans Zimmer est magistrale.'
      },
      {
        user: users[2]._id,
        movie: movies[3]._id, // Pulp Fiction
        rating: 4,
        comment: 'Un classique de Tarantino avec des dialogues mémorables et une structure narrative unique.'
      },
      {
        user: users[1]._id,
        movie: movies[4]._id, // Matrix
        rating: 5,
        comment: 'Révolutionnaire à sa sortie et toujours aussi captivant. Un must-see de la science-fiction.'
      }
    ]);
    console.log(`✅ ${reviews.length} reviews créés`);

    console.log('\n🎉 Base de données initialisée avec succès!');
    console.log('\n📊 Résumé:');
    console.log(` - Admin: admin@netflix.com / admin123`);
    console.log(` - Users: ${users.length}`);
    console.log(` - Movies: ${movies.length}`);
    console.log(` - Rentals: ${rentals.length}`);
    console.log(` - Reviews: ${reviews.length}`);

    process.exit(0);

  } catch (error) {
    console.error(`❌ Erreur lors du seed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
