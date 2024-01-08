import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tbl_comments', (table: Knex.TableBuilder) => {
    table.increments('id').primary().notNullable();
    table.integer('article_id').unsigned().notNullable();
    table.foreign('article_id').references('tbl_articles.id');
    table.string('nickname').notNullable();
    table.text('comment').notNullable();
    table.integer('parent_id').unsigned();
    table.foreign('parent_id').references('tbl_comments.id');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tbl_comments');
}
