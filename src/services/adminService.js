import prisma from '../prismaClient.js';

export const getDashboardStats = async () => {
    // countUser: only users with role USER
    const countUser = await prisma.user.count({ where: { role: 'USER' } });

    // Report counts by status
    const countReportPending = await prisma.report.count({ where: { status: 'PENDING' } });
    const countReportApproved = await prisma.report.count({ where: { status: 'APPROVED' } });
    const countReportRejected = await prisma.report.count({ where: { status: 'REJECTED' } });
    const countReportSolved = await prisma.report.count({ where: { status: 'SOLVED' } });

    return {
        countUser,
        countReportPending,
        countReportApproved,
        countReportRejected,
        countReportSolved
    };
};

export const getAllReportsForMap = async () => {
    return await prisma.report.findMany({
        include: {
            user: { select: { name: true, email: true } },
            fishReference: { select: { name: true, dangerLevel: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Re-use for list view as it fetches all necessary data
export const getAllReports = async () => {
    return await getAllReportsForMap();
};

export const updateReportStatus = async (reportId, status, adminNote) => {
    return await prisma.report.update({
        where: { id: reportId },
        data: {
            status,
            adminNote
        }
    });
};
