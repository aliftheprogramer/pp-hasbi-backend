import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardStats = async () => {
    // countUser: only users with role USER
    const countUser = await User.countDocuments({ role: 'USER' });

    // Report counts by status
    const countReportPending = await Report.countDocuments({ status: 'PENDING' });
    const countReportApproved = await Report.countDocuments({ status: 'APPROVED' });
    const countReportRejected = await Report.countDocuments({ status: 'REJECTED' });
    const countReportSolved = await Report.countDocuments({ status: 'SOLVED' });

    return {
        countUser,
        countReportPending,
        countReportApproved,
        countReportRejected,
        countReportSolved
    };
};

export const getAllReportsForMap = async () => {
    return await Report.find({})
        .populate({
            path: 'user',
            select: 'name email'
        })
        .populate({
            path: 'fishReference',
            select: 'name dangerLevel'
        })
        .sort({ createdAt: -1 });
};

// Re-use for list view as it fetches all necessary data
export const getAllReports = async () => {
    return await getAllReportsForMap();
};

export const updateReportStatus = async (reportId, status, adminNote) => {
    return await Report.findByIdAndUpdate(reportId, {
        status,
        adminNote
    }, { new: true });
};
