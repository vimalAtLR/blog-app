import { NextFunction, Response } from 'express';
import { ResponseHandler, RespError } from '../common/response';
import { isValidObject } from '../common/app_functions';
import ArticleVS from '../validation/article.validation';
import BlogService from '../services/blog.service';
import { CustomeRequest } from '../types/comman';

export default class BlogController {
  private resp = new ResponseHandler();
  private articleVS = new ArticleVS();
  private blogService = new BlogService();

  public async create(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.body;
    const isValid = await isValidObject(params, this.articleVS.create());
    if (isValid.status) {
      const resp = await this.blogService.create(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }
  public async createWithQueue(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.body;
    const isValid = await isValidObject(params, this.articleVS.create());
    if (isValid.status) {
      const resp = await this.blogService.createWithQueue(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }

  public async sendMessage(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.body;
    const isValid = await isValidObject(params, this.articleVS.sendMessage());
    if (isValid.status) {
      const resp = await this.blogService.sendMessage(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }

  public async articleList(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.query;
    const isValid = await isValidObject(params, this.articleVS.getArticles());
    if (isValid.status) {
      const resp = await this.blogService.articleList(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }

  public async getContent(request: CustomeRequest, response: Response, next: NextFunction) {
    const params = request.params;
    const isValid = await isValidObject(params, this.articleVS.getContent());
    if (isValid.status) {
      const resp = await this.blogService.getContent(params);
      this.resp.resp(response).send(resp, next);
    } else {
      this.resp.resp(response).error(RespError.validation(isValid.error!), next);
    }
  }
}
