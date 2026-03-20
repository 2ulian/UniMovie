import Movie from '../models/Movie.js';

// @desc    Récupérer tous les films (avec filtres, recherche, pagination)
// @route   GET /api/movies
// @access  Public
export const getAllMovies = async (req, res, next) => {
  try {
    const { search, genre, year, sort, page = 1, limit = 10 } = req.query;

    // Construction du filtre
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre) {
      query.genre = genre;
    }

    if (year) {
      query.year = parseInt(year);
    }

    // Tri
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'year') sortOption = { year: -1 };
    else if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'price') sortOption = { price: 1 };

    // Pagination
    const skip = (page - 1) * limit;

    // Exécution de la requête
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Comptage total pour la pagination
    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer un film par ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer les statistiques des films
// @route   GET /api/movies/stats
// @access  Public (sera protégé admin séance 9)
export const getMovieStats = async (req, res, next) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const availableMovies = await Movie.countDocuments({ isAvailable: true });

    const totalRevenue = await Movie.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$rentalCount'] } }
        }
      }
    ]);

    const statsByGenre = await Movie.getStatsByGenre();

    const topRated = await Movie.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(5)
      .select('title rating rentalCount');

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        availableMovies,
        totalRevenue: totalRevenue[0]?.total || 0,
        statsByGenre,
        topRated
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Récupérer des films similaires
// @route   GET /api/movies/:id/similar
// @access  Public
export const getSimilarMovies = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    // Trouver des films du même genre
    const similarMovies = await Movie.find({
      genre: { $in: movie.genre },
      _id: { $ne: movie._id }, // Exclure le film actuel
      isAvailable: true
    })
      .sort({ rating: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: similarMovies.length,
      data: similarMovies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un film
// @route   POST /api/movies
// @access  Admin (sera protégé séance 9)
export const createMovie = async (req, res, next) => {
  try {
    const { title, description, poster, backdrop, genre, year, duration, price, rating } = req.body;

    // Créer le film
    const movie = await Movie.create({
      title,
      description,
      poster,
      backdrop,
      genre,
      year,
      duration,
      price,
      rating
    });

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un film
// @route   PUT /api/movies/:id
// @access  Admin (sera protégé séance 9)
export const updateMovie = async (req, res, next) => {
  try {
    // Mise à jour
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // Retourner le document modifié
        runValidators: true // Exécuter les validations
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedMovie
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un film
// @route   DELETE /api/movies/:id
// @access  Admin (sera protégé séance 9)
export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Film non trouvé'
      });
    }

    // Vérifiez qu'il n'y ait pas de locations actives
    const { default: Rental } = await import('../models/Rental.js');
    const activeRentals = await Rental.countDocuments({
      movie: movie._id,
      status: 'active'
    });

    if (activeRentals > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : ${activeRentals} location(s) active(s) en cours`
      });
    }

    await movie.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Film supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};
