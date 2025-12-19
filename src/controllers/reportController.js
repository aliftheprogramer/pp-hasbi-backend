import * as ReportService from '../services/reportService.js';

export const createReport = async (req, res) => {
    try {
        const { description, fishReferenceId, latitude, longitude, addressText } = req.body;

        // Handle file upload
        // Multer-storage-cloudinary places the URL in req.file.path
        const photoUrl = req.file ? req.file.path : null;
        if (!photoUrl) {
            return res.status(400).json({ success: false, error: "Photo is required" });
        }

        // Validate coordinates
        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, error: "Coordinates are required" });
        }

        const report = await ReportService.createReport({
            userId: req.user.userId, // From authMiddleware
            fishReferenceId,
            description,
            photoUrl,
            latitude,
            longitude,
            addressText
        });

        const baseUrl = getBaseUrl(req);
        const transformedReport = {
            ...report,
            photoUrl: transformUrl(report.photoUrl, baseUrl),
            // fishReference and user might not be populated in create return, 
            // but if they were, they'd need transformation too. 
            // Usually create returns the simple object.
        };

        res.status(201).json({ success: true, data: transformedReport });
    } catch (error) {
        console.error("Create Report Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMyReports = async (req, res) => {
    try {
        const reportList = await ReportService.getReportsByUserId(req.user.userId);
        const baseUrl = getBaseUrl(req);

        const transformedReports = reportList.map(report => ({
            ...report,
            photoUrl: transformUrl(report.photoUrl, baseUrl),
            user: report.user ? {
                ...report.user,
                avatarUrl: transformUrl(report.user.avatarUrl, baseUrl)
            } : null,
            fishReference: report.fishReference ? {
                ...report.fishReference,
                imageUrl: transformUrl(report.fishReference.imageUrl, baseUrl)
            } : null
        }));

        res.status(200).json({ success: true, data: transformedReports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

const transformUrl = (url, baseUrl) => {
    if (!url) return null;
    return url.startsWith('/') ? `${baseUrl}${url}` : url;
};

export const getApprovedReports = async (req, res) => {
    try {
        const reports = await ReportService.getApprovedReports();
        const baseUrl = getBaseUrl(req);

        const transformedReports = reports.map(report => ({
            ...report,
            photoUrl: transformUrl(report.photoUrl, baseUrl),
            user: report.user ? {
                ...report.user,
                avatarUrl: transformUrl(report.user.avatarUrl, baseUrl)
            } : null,
            fishReference: report.fishReference ? {
                ...report.fishReference,
                imageUrl: transformUrl(report.fishReference.imageUrl, baseUrl)
            } : null
        }));

        res.status(200).json({ success: true, data: transformedReports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const filters = {};
        if (req.query.status) {
            filters.where = { status: req.query.status.toUpperCase() };
        }

        const reports = await ReportService.getAllReports(filters);
        const baseUrl = getBaseUrl(req);

        const transformedReports = reports.map(report => ({
            ...report,
            photoUrl: transformUrl(report.photoUrl, baseUrl),
            user: report.user ? {
                ...report.user,
                avatarUrl: transformUrl(report.user.avatarUrl, baseUrl)
            } : null,
            fishReference: report.fishReference ? {
                ...report.fishReference,
                imageUrl: transformUrl(report.fishReference.imageUrl, baseUrl)
            } : null
        }));

        res.status(200).json({ success: true, data: transformedReports });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const report = await ReportService.getReportById(req.params.id);
        const baseUrl = getBaseUrl(req);

        const transformedReport = {
            ...report,
            photoUrl: transformUrl(report.photoUrl, baseUrl),
            user: report.user ? {
                ...report.user,
                avatarUrl: transformUrl(report.user.avatarUrl, baseUrl)
            } : null,
            fishReference: report.fishReference ? {
                ...report.fishReference,
                imageUrl: transformUrl(report.fishReference.imageUrl, baseUrl)
            } : null
        };

        res.status(200).json({ success: true, data: transformedReport });
    } catch (error) {
        res.status(error.message === 'Report not found' ? 404 : 500).json({ success: false, error: error.message });
    }
};

export const updateReport = async (req, res) => {
    try {
        const updatedReport = await ReportService.updateReport(req.params.id, req.body);
        const baseUrl = getBaseUrl(req);

        const transformedReport = {
            ...updatedReport,
            photoUrl: transformUrl(updatedReport.photoUrl, baseUrl),
            user: updatedReport.user ? {
                ...updatedReport.user,
                avatarUrl: transformUrl(updatedReport.user.avatarUrl, baseUrl)
            } : null,
            fishReference: updatedReport.fishReference ? {
                ...updatedReport.fishReference,
                imageUrl: transformUrl(updatedReport.fishReference.imageUrl, baseUrl)
            } : null
        };

        res.status(200).json({ success: true, message: 'Report updated successfully', data: transformedReport });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteReport = async (req, res) => {
    try {
        await ReportService.deleteReport(req.params.id);
        res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
