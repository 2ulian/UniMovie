import express from 'express';
import {
  getAllRentals,
  getMyRentals,
  getRentalStats,
  createRental,
  cancelRental,
  getRecommendations
} from '../controllers/rental.controller.js';
// import { protect, admin } from '../middleware/auth.middleware.js'; // Séance 9

const router = express.Router();

// Routes publiques / temporaires sans auth (pour tester)
router.get('/', getAllRentals);
router.get('/my-rentals', getMyRentals);
router.get('/stats', getRentalStats);
router.get('/recommendations', getRecommendations);
router.post('/', createRental);
router.delete('/:id', cancelRental);

export default router;
