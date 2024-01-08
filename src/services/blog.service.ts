import { RespError } from '../common/response';
import { ServiceReturnVal } from '../types/comman';
import knex from '../knex';
import tblArticle from '../models/Article';
import { isEmpty } from '../common/app_functions';
import { CreateArticle } from '../types/article';
import { sendMessageToCreateArticle, sendMessageToQueue } from '../common/queueService';

export default class ArticleService {
  async create(params: CreateArticle): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      const article = await knex(tblArticle.name).insert(params);

      returnVal.data = await knex(tblArticle.name)
        .first()
        .where({ id: article[0], [tblArticle.ins.deletedAt]: null });
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  async createWithQueue(params: CreateArticle): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      sendMessageToCreateArticle(params);
      returnVal.data = { result: 'Added task of creation of Article in queue' };
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  async articleList(params): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      returnVal.data = await knex(tblArticle.name)
        .where({ [tblArticle.ins.deletedAt]: null })
        .limit(params.limit)
        .offset(params.page * params.limit - params.limit);
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  async getContent(params): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      const article = await knex(tblArticle.name)
        .where({
          [tblArticle.ins.id]: params.id,
          [tblArticle.ins.deletedAt]: null,
        })
        .first();
      if (!isEmpty(article)) {
        returnVal.data = article;
      } else {
        returnVal.error = new RespError(404, 'Article not found');
      }
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  async sendMessage(params: CreateArticle): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      sendMessageToQueue(params);

      returnVal.data = { result: 'msg send' };
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }
}
