import joi from 'joi';

export default class CommentVS {
  public addComment() {
    const schema = {
      articleId: joi.string().required(),
      nickname: joi.string().required(),
      comment: joi.string().required(),
      parentId: joi.string().required().allow(null),
    };
    return schema;
  }

  public getArticles() {
    const schema = {
      page: joi.string().required(),
      limit: joi.string().required(),
    };
    return schema;
  }

  public getContent() {
    const schema = {
      id: joi.string().required(),
    };
    return schema;
  }
}
