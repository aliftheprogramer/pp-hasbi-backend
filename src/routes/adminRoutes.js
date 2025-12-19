import express from 'express';
import * as AdminController from '../controllers/adminController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require login AND admin role
router.use(authenticateToken, authorizeAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.get('/map', AdminController.getMapReports);
router.get('/reports', AdminController.getAllReports); // New endpoint for list view
router.put('/reports/:id/status', AdminController.updateReportStatus);

export default router;
