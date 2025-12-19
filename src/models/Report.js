import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        alias: 'user_id'
    },
    fishReferenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FishReference',
        alias: 'fish_reference_id'
    },
    description: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true,
        alias: 'photo_url'
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    addressText: {
        type: String,
        alias: 'address_text'
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SOLVED'],
        default: 'PENDING'
    },
    adminNote: {
        type: String,
        alias: 'admin_note'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for user
reportSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Virtual populate for fishReference
reportSchema.virtual('fishReference', {
    ref: 'FishReference',
    localField: 'fishReferenceId',
    foreignField: '_id',
    justOne: true
});

const Report = mongoose.model('Report', reportSchema, 'reports');

export default Report;
