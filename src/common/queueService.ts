import amqp, { Channel } from 'amqplib';
import { MyObject } from '../types/comman';
import tblArticle from '../models/Article';
import tblComment from '../models/Comment';
import knex from '../knex';
import { isEmpty } from './app_functions';
import logger from './logger';

let channel: Channel, connection;

const deadLetterExchange = 'dead_letter_exchange';
const deadLetterQueue = 'dead_letter_queue';
async function connectQueue() {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('msg-queue');
    await channel.assertQueue('create-article', {
      autoDelete: true,
      durable: true,
      deadLetterExchange: deadLetterExchange,
      deadLetterRoutingKey: deadLetterQueue,
    });
    await channel.assertQueue('add-comment', {
      autoDelete: true,
      durable: true,
      deadLetterExchange: deadLetterExchange,
      deadLetterRoutingKey: deadLetterQueue,
    });
    await channel.assertExchange(deadLetterExchange, 'direct', {
      durable: true,
    });

    await channel.assertQueue(deadLetterQueue, {
      durable: true,
    });

    await channel.bindQueue(deadLetterQueue, deadLetterExchange, deadLetterQueue);
  } catch (error) {
    return error;
  }
}

function sendMessageToQueue(data: MyObject) {
  channel.sendToQueue('msg-queue', Buffer.from(JSON.stringify(data)));
}

function sendMessageToCreateArticle(data: MyObject) {
  channel.sendToQueue('create-article', Buffer.from(JSON.stringify(data)));
}

function sendMessageToAddComment(data: MyObject) {
  channel.sendToQueue('add-comment', Buffer.from(JSON.stringify(data)));
}

async function receiveMessage() {
  channel.consume('msg-queue', (data) => {
    // eslint-disable-next-line no-console
    console.log('Received Message - ' + `${Buffer.from(data.content)}`);
    channel.ack(data);
  });
}

async function manageDeadQueue() {
  channel.consume('dead_letter_queue', (data) => {
    // eslint-disable-next-line no-console
    console.log('Received Message - ' + `${Buffer.from(data.content)}`);
    channel.ack(data);
  });
}

function createArticleByQueue() {
  channel.consume('create-article', async (data) => {
    const params = JSON.parse(`${Buffer.from(data.content)}`);

    const article = await knex(tblArticle.name).insert(params);

    await knex(tblArticle.name)
      .first()
      .where({ id: article[0], [tblArticle.ins.deletedAt]: null });
    channel.ack(data);
  });
}

function addCommentByQueue() {
  channel.consume('add-comment', async (data) => {
    const params = JSON.parse(`${Buffer.from(data.content)}`);
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
          await knex(tblComment.name).first().where({ id: comment[0] });
          channel.ack(data);
        } else {
          channel.publish(deadLetterExchange, deadLetterQueue, Buffer.from(data.content.toString()));
          channel.ack(data);
          logger.error('Parent comment not found');
        }
      } else {
        const comment = await knex(tblComment.name).insert({
          [tblComment.ins.articleId]: params.articleId,
          [tblComment.ins.comment]: params.comment,
          [tblComment.ins.nickname]: params.nickname,
          [tblComment.ins.parentId]: null,
        });
        await knex(tblComment.name).first().where({ id: comment[0] });
        channel.ack(data);
      }
    } else {
      logger.error('Article not found');
    }
  });
}

connectQueue()
  .then(() => {
    receiveMessage();
    createArticleByQueue();
    addCommentByQueue();
    manageDeadQueue();
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

export { sendMessageToQueue, sendMessageToCreateArticle, sendMessageToAddComment };
