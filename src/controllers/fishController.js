import * as FishService from '../services/fishService.js';

const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

const transformFish = (fish, baseUrl) => {
    if (!fish) return null;
    return {
        ...fish,
        imageUrl: fish.imageUrl && fish.imageUrl.startsWith('/')
            ? `${baseUrl}${fish.imageUrl}`
            : fish.imageUrl,
    };
};

export const getAllFish = async (req, res) => {
    try {
        const fishList = await FishService.getAllFish();
        const baseUrl = getBaseUrl(req);
        const transformedFish = fishList.map(fish => transformFish(fish, baseUrl));
        res.status(200).json({ success: true, data: transformedFish });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getFishById = async (req, res) => {
    try {
        const fish = await FishService.getFishById(req.params.id);
        const baseUrl = getBaseUrl(req);
        res.status(200).json({ success: true, data: transformFish(fish, baseUrl) });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
