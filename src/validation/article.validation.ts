import joi from 'joi';

export default class LoginVS {
  public create() {
    const schema = {
      title: joi.string().required(),
      nickname: joi.string().required(),
      content: joi.string().required(),
    };
    return schema;
  }

  public sendMessage() {
    const schema = {
      title: joi.string().required(),
      message: joi.string().required(),
    };
    return schema;
  }

  public getArticles() {
    const schema = {
      page: joi.number().required(),
      limit: joi.number().required(),
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
