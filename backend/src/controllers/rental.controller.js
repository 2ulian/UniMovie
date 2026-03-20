import Rental from '../models/Rental.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';

// @desc    Récupérer toutes les locations
// @route   GET /api/rentals
// @access  Admin (sera protégé séance 9)
export const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email')
      .populate('movie', 'title poster price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les locations de l'utilisateur connecté
// @route   GET /api/rentals/my-rentals
// @access  Private (forcé pour l'instant)
export const getMyRentals = async (req, res, next) => {
  try {
    // TODO séance 9 : utiliser req.user._id depuis le middleware d'auth
    // Pour l'instant on force un userId depuis les query params ou le premier user en DB
    let userId = req.query.userId;

    if (!userId) {
      const firstUser = await User.findOne();
      if (!firstUser) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur trouvé'
        });
      }
      userId = firstUser._id;
    }

    const { status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const rentals = await Rental.find(query)
      .populate('movie', 'title poster price duration genre')
      .sort({ rentalDate: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques sur les locations
// @route   GET /api/rentals/stats
// @access  Admin (sera protégé séance 9)
export const getRentalStats = async (req, res, next) => {
  try {
    const totalRentals = await Rental.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const expiredRentals = await Rental.countDocuments({ status: 'expired' });
    const cancelledRentals = await Rental.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Rental.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);

    const rentalsByMonth = await Rental.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$rentalDate' },
            month: { $month: '$rentalDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$price' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRentals,
        activeRentals,
        expiredRentals,
        cancelledRentals,
        totalRevenue: totalRevenue[0]?.total || 0,
        rentalsByMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une location
// @route   POST /api/rentals
// @access  Private (forcé pour l'instant)
export const createRental = async (req, res, next) => {
  try {
    const { movieId, userId: bodyUserId } = req.body;

    // TODO séance 9 : utiliser req.user._id depuis le middleware d'auth
    let userId = bodyUserId;
    if (!userId) {
      const firstUser = await User.findOne();
      if (!firstUser) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur trouvé'
        });
      }
      userId = firstUser._id;
    }

    // Vérifier que le film existe et est disponible
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    if (!movie.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Ce film n\'est pas disponible à la location'
      });
    }

    // Vérifier qu'il n'y a pas déjà une location active pour ce film/utilisateur
    const existingRental = await Rental.findOne({
      user: userId,
      movie: movieId,
      status: 'active'
    });

    if (existingRental) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà une location active pour ce film'
      });
    }

    // Créer la location
    const rental = await Rental.create({
      user: userId,
      movie: movieId,
      price: movie.price
    });

    // Incrémenter le compteur de location du film
    await movie.incrementRentalCount();

    const populatedRental = await rental.populate([
      { path: 'user', select: 'name email' },
      { path: 'movie', select: 'title poster price' }
    ]);

    res.status(201).json({
      success: true,
      data: populatedRental
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Annuler/Supprimer une location
// @route   DELETE /api/rentals/:id
// @access  Private (forcé pour l'instant)
export const cancelRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Location non trouvée'
      });
    }

    if (rental.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Seules les locations actives peuvent être annulées'
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.status(200).json({
      success: true,
      message: 'Location annulée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir des recommandations personnalisées
// @route   GET /api/rentals/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
  try {
    // TODO séance 9 : utiliser req.user._id depuis le middleware d'auth
    let userId = req.query.userId;
    if (!userId) {
      const firstUser = await User.findOne();
      userId = firstUser?._id;
    }

    // 1. Obtenir les genres des films loués par l'utilisateur
    const userRentals = await Rental.find({ user: userId }).populate('movie', 'genre');

    // Si pas d'historique, recommander les plus populaires
    if (userRentals.length === 0) {
      const popular = await Movie.getPopularMovies(6);
      return res.status(200).json({
        success: true,
        data: popular
      });
    }

    // 2. Compter les genres préférés
    const genreCount = {};
    userRentals.forEach(rental => {
      rental.movie?.genre?.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });

    // 3. Trier les genres par préférence
    const preferredGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    // 4. Obtenir les IDs des films déjà loués
    const rentedMovieIds = userRentals.map(r => r.movie?._id).filter(Boolean);

    // 5. Recommander des films de ces genres non encore loués
    const recommendations = await Movie.find({
      genre: { $in: preferredGenres },
      _id: { $nin: rentedMovieIds },
      isAvailable: true
    })
      .sort({ rating: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};
