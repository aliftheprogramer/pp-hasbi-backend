// src/routes/userRoutes.js
import express from 'express';
import * as UserController from '../controllers/userController.js'; // Path relatif dari src/routes/ ke src/controllers/
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.post('/register', UserController.registerUser); // Pindah ke /api/auth/register
// router.post('/login', UserController.loginUser); // Pindah ke /api/auth/login
// router.post('/logout', UserController.logoutUser);

// router.post('/logout', UserController.logoutUser);

router.get('/profile', authenticateToken, UserController.getMyProfile);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;