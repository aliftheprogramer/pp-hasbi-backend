import * as AdminService from '../services/adminService.js';

export const getDashboard = async (req, res) => {
    try {
        const stats = await AdminService.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMapReports = async (req, res) => {
    try {
        const reports = await AdminService.getAllReportsForMap();
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await AdminService.getAllReports();
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        if (!['APPROVED', 'REJECTED', 'PENDING', 'SOLVED'].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const updatedReport = await AdminService.updateReportStatus(id, status, adminNote);
        res.status(200).json({ success: true, data: updatedReport });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
