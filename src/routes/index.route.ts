import { Router } from 'express';
import BlogRoute from './blog.route';
import CommentRoute from './comment.route';

const router = Router();

new BlogRoute(router);
new CommentRoute(router);

export default router;
