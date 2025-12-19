import prisma from '../prismaClient.js';

export const createReport = async (data) => {
    return await prisma.report.create({
        data: {
            userId: data.userId,
            fishReferenceId: data.fishReferenceId || null,
            description: data.description,
            photoUrl: data.photoUrl,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            addressText: data.addressText,
            status: 'PENDING'
        }
    });
};

export const getReportsByUserId = async (userId) => {
    return await prisma.report.findMany({
        where: { userId },
        include: { fishReference: true },
        orderBy: { createdAt: 'desc' }
    });
};

export const getApprovedReports = async () => {
    return await prisma.report.findMany({
        where: { status: 'APPROVED' },
        include: {
            fishReference: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getAllReports = async (filters = {}) => {
    return await prisma.report.findMany({
        where: filters.where,
        include: {
            fishReference: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const getReportById = async (reportId) => {
    const report = await prisma.report.findUnique({
        where: { id: reportId },
        include: {
            fishReference: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });

    if (!report) {
        throw new Error('Report not found');
    }

    return report;
};

export const updateReport = async (reportId, updateData) => {
    return await prisma.report.update({
        where: { id: reportId },
        data: updateData,
        include: { fishReference: true }
    });
};

export const deleteReport = async (reportId) => {
    return await prisma.report.delete({
        where: { id: reportId }
    });
};
