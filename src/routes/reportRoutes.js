import express from 'express';
import * as ReportController from '../controllers/reportController.js';
import upload from '../middleware/uploadMiddleware.js'; // Assuming this exists based on previous list
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();


// Existing routes
router.post('/', authenticateToken, upload.single('photo'), ReportController.createReport);
router.get('/my-reports', authenticateToken, ReportController.getMyReports);
router.get('/public/approved', authenticateToken, ReportController.getApprovedReports);

// New general CRUD routes (consider role-based access for some of these in future)
router.get('/', authenticateToken, ReportController.getAllReports);
router.get('/:id', authenticateToken, ReportController.getReportById);
router.put('/:id', authenticateToken, ReportController.updateReport);
router.delete('/:id', authenticateToken, ReportController.deleteReport);

export default router;

