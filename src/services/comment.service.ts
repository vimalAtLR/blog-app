import { RespError } from '../common/response';
import { MyObject, ServiceReturnVal } from '../types/comman';
import knex from '../knex';
import tblArticle from '../models/Article';
import tblComment from '../models/Comment';
import { AddComment } from '../types/comment';
import { isEmpty } from '../common/app_functions';
import { sendMessageToAddComment } from '../common/queueService';

export default class CommentService {
  async addComment(params: AddComment): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      const article = await knex(tblArticle.name).where({ [tblArticle.ins.id]: params.articleId });

      if (!isEmpty(article)) {
        if (!isEmpty(params.parentId)) {
          const parentComment = await knex(tblComment.name).where({
            [tblComment.ins.id]: params.parentId,
            [tblComment.ins.articleId]: params.articleId,
          });

          if (!isEmpty(parentComment)) {
            const comment = await knex(tblComment.name).insert({
              [tblComment.ins.articleId]: params.articleId,
              [tblComment.ins.comment]: params.comment,
              [tblComment.ins.nickname]: params.nickname,
              [tblComment.ins.parentId]: params.parentId,
            });
            returnVal.data = await knex(tblComment.name).first().where({ id: comment[0] });
          } else {
            returnVal.error = new RespError(404, 'Parent comment not found');
          }
        } else {
          const comment = await knex(tblComment.name).insert({
            [tblComment.ins.articleId]: params.articleId,
            [tblComment.ins.comment]: params.comment,
            [tblComment.ins.nickname]: params.nickname,
            [tblComment.ins.parentId]: null,
          });
          returnVal.data = await knex(tblComment.name).first().where({ id: comment[0] });
        }
      } else {
        returnVal.error = new RespError(404, 'Article not found');
      }
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  async addCommentWithQueue(params: AddComment): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      sendMessageToAddComment(params);
      returnVal.data = { result: 'Added task of adding comment in queue' };
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }

  private organizeComments(comments: Array<MyObject>) {
    const commentMap = new Map();

    comments.forEach((comment: MyObject) => {
      const parentId = comment.parent_id;
      if (!commentMap.has(parentId)) {
        commentMap.set(parentId, []);
      }
      commentMap.get(parentId).push(comment);
    });

    function addChildToParent(parent: MyObject) {
      if (commentMap.has(parent.id)) {
        parent.children = commentMap.get(parent.id);
        parent.children.forEach((child) => addChildToParent(child));
      }
    }

    const rootComments = commentMap.get(null) || [];

    rootComments.forEach((rootComment) => addChildToParent(rootComment));

    return rootComments;
  }

  async commentList(params): Promise<ServiceReturnVal> {
    const returnVal: ServiceReturnVal = {};
    try {
      const article = await knex(tblArticle.name)
        .where({
          [tblArticle.ins.id]: params.articleId,
          [tblArticle.ins.deletedAt]: null,
        })
        .first();
      if (!isEmpty(article)) {
        const rows = await knex
          .select('*')
          .from(tblComment.name)
          .where({ [tblComment.ins.articleId]: params.articleId, [tblComment.ins.deletedAt]: null });

        returnVal.data = this.organizeComments(rows);
      } else {
        returnVal.error = new RespError(404, 'Article not found');
      }
    } catch (error) {
      returnVal.error = new RespError(500, error.message);
    }
    return returnVal;
  }
}
