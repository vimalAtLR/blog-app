// __tests__/app.test.ts
import request from 'supertest';
import server from './server';

describe('API Endpoints', () => {
  let returnId;
  test('POST /create-article should return status 200', async () => {
    const requestBody = {
      title: 'test1',
      nickname: 'nickname',
      content: 'content',
    };
    const response = await request(server).post('/create-article').send(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    returnId = response.body.data.id;
    expect(typeof response.body.data).toBe('object');
  });

  test('GET /list-article should return status 200', async () => {
    const response = await request(server).get('/list-article?page=1&limit=20');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body.data).toBe('object');
  });

  test('GET /article-content/:id should return status 200', async () => {
    const response = await request(server).get(`/article-content/${returnId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(typeof response.body.data).toBe('object');
  });

  test('GET /article-content/:id should return status 404(article not found)', async () => {
    const response = await request(server).get(`/article-content/1000`);
    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    expect(response.body.error).toBeDefined();
    expect(typeof response.body.error).toBe('string');
  });
});
