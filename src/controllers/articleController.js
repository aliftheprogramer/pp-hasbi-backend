import * as ArticleService from '../services/articleService.js';

const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

const transformArticle = (article, baseUrl) => {
    if (!article) return null;
    return {
        ...article,
        thumbnailUrl: article.thumbnailUrl && article.thumbnailUrl.startsWith('/')
            ? `${baseUrl}${article.thumbnailUrl}`
            : article.thumbnailUrl,
    };
};

export const getAllArticles = async (req, res) => {
    try {
        const articles = await ArticleService.getAllArticles();
        const baseUrl = getBaseUrl(req);
        const transformedArticles = articles.map(article => transformArticle(article, baseUrl));
        res.status(200).json({ success: true, data: transformedArticles });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await ArticleService.getArticleById(req.params.id);
        const baseUrl = getBaseUrl(req);
        res.status(200).json({ success: true, data: transformArticle(article, baseUrl) });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
