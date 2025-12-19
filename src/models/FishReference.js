import mongoose from 'mongoose';

const fishReferenceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scientificName: {
        type: String,
        alias: 'scientific_name'
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        alias: 'image_url'
    },
    dangerLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        required: true,
        alias: 'danger_level'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const FishReference = mongoose.model('FishReference', fishReferenceSchema, 'fish_references');

export default FishReference;
