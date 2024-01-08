import { NextFunction, Response } from 'express';
import { ResponseHandler, RespError } from '../common/response';
import { isValidObject } from '../common/app_functions';
import CommentVS from '../validation/comment.validation';
import CommentService from '../services/comment.service';
import { CustomeRequest } from '../types/comman';

export default class CommentController {
  private resp = new ResponseHandler();
  private commentVS = new CommentVS();
  private commentService = new CommentService();

  public async addComment(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.body;
    const isValid = await isValidObject(params, this.commentVS.addComment());
    if (isValid.status) {
      const resp = await this.commentService.addComment(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }

  public async addCommentWithQueue(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.body;
    const isValid = await isValidObject(params, this.commentVS.addComment());
    if (isValid.status) {
      const resp = await this.commentService.addCommentWithQueue(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }

  public async commentList(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.params;
    // const isValid = await isValidObject(params, this.commentVS.getArticles());
    // if (isValid.status) {
    const resp = await this.commentService.commentList(params);
    this.resp.resp(response).send(resp, next);
    // } else {
    //   this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    // }
  }
}
