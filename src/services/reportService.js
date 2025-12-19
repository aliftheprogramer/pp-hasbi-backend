import Report from '../models/Report.js';

export const createReport = async (data) => {
    const report = new Report({
        userId: data.userId,
        fishReferenceId: data.fishReferenceId || null,
        description: data.description,
        photoUrl: data.photoUrl,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        addressText: data.addressText,
        status: 'PENDING'
    });
    return await report.save();
};

export const getReportsByUserId = async (userId) => {
    return await Report.find({ userId })
        .populate('fishReference')
        .sort({ createdAt: -1 });
};

export const getApprovedReports = async () => {
    return await Report.find({ status: 'APPROVED' })
        .populate('fishReference')
        .populate({
            path: 'user',
            select: 'id name avatarUrl' // Select specific fields from populate
        })
        .sort({ createdAt: -1 });
};

export const getAllReports = async (filters = {}) => {
    const query = filters.where || {};
    return await Report.find(query)
        .populate('fishReference')
        .populate({
            path: 'user',
            select: 'id name email avatarUrl'
        })
        .sort({ createdAt: -1 });
};

export const getReportById = async (reportId) => {
    try {
        const report = await Report.findById(reportId)
            .populate('fishReference')
            .populate({
                path: 'user',
                select: 'id name email avatarUrl'
            });

        if (!report) {
            throw new Error('Report not found');
        }

        return report;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new Error('Report not found');
        }
        throw error;
    }
};

export const updateReport = async (reportId, updateData) => {
    try {
        const report = await Report.findByIdAndUpdate(reportId, updateData, { new: true })
            .populate('fishReference');
        return report;
    } catch (error) {
        throw error;
    }
};

export const deleteReport = async (reportId) => {
    return await Report.findByIdAndDelete(reportId);
};
