import express from 'express';
import * as ArticleController from '../controllers/articleController.js';

const router = express.Router();

router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticleById);

export default router;
