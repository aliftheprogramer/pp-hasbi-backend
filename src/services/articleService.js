import prisma from '../prismaClient.js';

export const getAllArticles = async () => {
    return await prisma.article.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getArticleById = async (id) => {
    if (!id) throw new Error("Article ID is required");

    const article = await prisma.article.findUnique({
        where: { id }
    });

    if (!article) throw new Error("Article not found");
    return article;
};
