import { MyObject } from '../types/comman';

class TblUser {
  name: string;
  cols: MyObject;
  ins: MyObject;
  constructor() {
    this.name = 'tbl_comments';
    this.cols = {
      id: `${this.name}.id`,
      articleId: `${this.name}.article_id`,
      nickname: `${this.name}.nickname`,
      comment: `${this.name}.comment`,
      parentId: `${this.name}.parent_id`,
      createdAt: `${this.name}.created_at`,
      updatedAt: `${this.name}.updated_at`,
      deletedAt: `${this.name}.deleted_at`,
    };
    this.ins = {
      id: `id`,
      articleId: `article_id`,
      nickname: `nickname`,
      comment: `comment`,
      parentId: `parent_id`,
      createdAt: `created_at`,
      updatedAt: `updated_at`,
      deletedAt: `deleted_at`,
    };
  }
}

const tblUser = new TblUser();
export default tblUser;
