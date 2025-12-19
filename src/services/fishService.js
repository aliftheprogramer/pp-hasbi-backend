import FishReference from '../models/FishReference.js';

export const getAllFish = async () => {
    return await FishReference.find({}).sort({ name: 1 });
};

export const getFishById = async (id) => {
    if (!id) throw new Error("Fish ID is required");

    try {
        const fish = await FishReference.findById(id);

        if (!fish) throw new Error("Fish not found");
        return fish;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new Error("Fish not found");
        }
        throw error;
    }
};
