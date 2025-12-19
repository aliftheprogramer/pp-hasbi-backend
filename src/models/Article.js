import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true,
        alias: 'thumbnail_url'
    },
    sourceUrl: {
        type: String,
        alias: 'source_url'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }, // Article only has createdAt in prisma schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Article = mongoose.model('Article', articleSchema, 'articles');

export default Article;
