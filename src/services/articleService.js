import Article from '../models/Article.js';

export const getAllArticles = async () => {
    return await Article.find({}).sort({ createdAt: -1 });
};

export const getArticleById = async (id) => {
    if (!id) throw new Error("Article ID is required");

    try {
        const article = await Article.findById(id);

        if (!article) throw new Error("Article not found");
        return article;
    } catch (error) {
        if (error.name === 'CastError') {
            throw new Error("Article not found");
        }
        throw error;
    }
};
