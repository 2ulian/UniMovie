import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Le film est requis']
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note doit être entre 1 et 5'],
    max: [5, 'La note doit être entre 1 et 5'],
    validate: {
      validator: Number.isInteger,
      message: 'La note doit être un nombre entier'
    }
  },
  comment: {
    type: String,
    required: [true, 'Le commentaire est requis'],
    trim: true,
    minlength: [10, 'Le commentaire doit contenir au moins 10 caractères'],
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// INDEX unique pour garantir un seul review par utilisateur par film
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// INDEX pour optimiser les requêtes
reviewSchema.index({ movie: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

// MÉTHODE STATIQUE pour calculer et mettre à jour la note moyenne d'un film
reviewSchema.statics.calculateAverageRating = async function(movieId) {
  const Movie = mongoose.model('Movie');
  
  const stats = await this.aggregate([
    {
      $match: { movie: movieId, isApproved: true }
    },
    {
      $group: {
        _id: '$movie',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    // Convertir la note de 1-5 vers 0-10
    const ratingOnTen = (stats[0].averageRating / 5) * 10;
    await Movie.findByIdAndUpdate(movieId, {
      rating: Math.round(ratingOnTen * 10) / 10 // Arrondir à 1 décimale
    });
    return {
      averageRating: stats[0].averageRating,
      ratingOnTen,
      numberOfReviews: stats[0].numberOfReviews
    };
  } else {
    await Movie.findByIdAndUpdate(movieId, { rating: 0 });
    return { averageRating: 0, ratingOnTen: 0, numberOfReviews: 0 };
  }
};

// MÉTHODE STATIQUE pour obtenir les reviews d'un film
reviewSchema.statics.getMovieReviews = function(movieId, limit = 10) {
  return this.find({ movie: movieId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// MÉTHODE STATIQUE pour obtenir les reviews d'un utilisateur
reviewSchema.statics.getUserReviews = function(userId) {
  return this.find({ user: userId })
    .populate('movie', 'title poster year')
    .sort({ createdAt: -1 });
};

// MÉTHODE STATIQUE pour vérifier si un utilisateur a déjà reviewé un film
reviewSchema.statics.hasUserReviewed = async function(userId, movieId) {
  const review = await this.findOne({ user: userId, movie: movieId });
  return !!review;
};

// MÉTHODE STATIQUE pour obtenir les statistiques des reviews
reviewSchema.statics.getReviewStats = async function(movieId) {
  const stats = await this.aggregate([
    {
      $match: { movie: movieId, isApproved: true }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  // Transformer en objet avec toutes les notes de 1 à 5
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats.forEach(stat => {
    ratingDistribution[stat._id] = stat.count;
  });

  return ratingDistribution;
};

// MIDDLEWARE post-save: Recalculer la note moyenne après chaque review
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.movie);
});

// MIDDLEWARE post-remove: Recalculer la note moyenne après suppression
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.movie);
  }
});

reviewSchema.post('deleteOne', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.movie);
  }
});

// VIRTUAL pour afficher les étoiles
reviewSchema.virtual('stars').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
