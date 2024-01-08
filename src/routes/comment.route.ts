import { Router } from 'express';
import CommentController from '../controllers/comment.controllers';

export default class BlogRoute {
  private router: Router;
  constructor(router: Router) {
    this.router = router;
    this.routes();
  }
  private commentController = new CommentController();

  routes() {
    this.router.post('/add-comment', this.commentController.addComment.bind(this.commentController));
    this.router.post('/add-comment-queue', this.commentController.addCommentWithQueue.bind(this.commentController));
    this.router.get('/list-comments/:articleId', this.commentController.commentList.bind(this.commentController));
    // this.router.get('/article-content/:id', this.commentController.getContent.bind(this.commentController));
  }
}
