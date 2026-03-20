import express from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
  getSimilarMovies
} from '../controllers/movie.controller.js';
// import { protect, admin } from '../middleware/auth.middleware.js'; // Séance 9

const router = express.Router();

// Routes publiques
router.get('/', getAllMovies);
router.get('/stats', getMovieStats); // TODO: Protéger avec admin (séance 9)
router.get('/:id', getMovieById);
router.get('/:id/similar', getSimilarMovies);

// Routes protégées admin (sera activé séance 9)
// router.post('/', protect, admin, createMovie);
// router.put('/:id', protect, admin, updateMovie);
// router.delete('/:id', protect, admin, deleteMovie);

// Routes temporaires sans authentification (pour tester)
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;
