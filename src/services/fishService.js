import prisma from '../prismaClient.js';

export const getAllFish = async () => {
    return await prisma.fishReference.findMany({
        orderBy: { name: 'asc' }
    });
};

export const getFishById = async (id) => {
    if (!id) throw new Error("Fish ID is required");

    const fish = await prisma.fishReference.findUnique({
        where: { id }
    });

    if (!fish) throw new Error("Fish not found");
    return fish;
};
