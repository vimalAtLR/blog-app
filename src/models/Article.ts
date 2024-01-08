import { MyObject } from '../types/comman';

class TblUser {
  name: string;
  cols: MyObject;
  ins: MyObject;
  constructor() {
    this.name = 'tbl_articles';
    this.cols = {
      id: `${this.name}.id`,
      title: `${this.name}.title`,
      nickname: `${this.name}.nickname`,
      content: `${this.name}.content`,
      createdAt: `${this.name}.created_at`,
      updatedAt: `${this.name}.updated_at`,
      deletedAt: `${this.name}.deleted_at`,
    };
    this.ins = {
      id: `id`,
      title: `title`,
      nickname: `nickname`,
      content: `content`,
      createdAt: `created_at`,
      updatedAt: `updated_at`,
      deletedAt: `deleted_at`,
    };
  }
}

const tblUser = new TblUser();
export default tblUser;
