import { Router } from 'express';
import BlogController from '../controllers/blog.controllers';

export default class BlogRoute {
  private router: Router;
  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  private blogController = new BlogController();

  routes() {
    this.router.post('/create-article', this.blogController.create.bind(this.blogController));
    this.router.post('/create-article-queue', this.blogController.createWithQueue.bind(this.blogController));
    this.router.post('/send-message', this.blogController.sendMessage.bind(this.blogController));
    this.router.get('/list-article', this.blogController.articleList.bind(this.blogController));
    this.router.get('/article-content/:id', this.blogController.getContent.bind(this.blogController));
  }
}
