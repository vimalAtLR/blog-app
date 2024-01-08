// __tests__/app.test.ts
import request from 'supertest';
import server from './server';

describe('API Endpoints', () => {
  test('POST /add-comment should return status 200', async () => {
    const requestBody = {
      articleId: '1',
      parentId: null,
      nickname: 'kishan1',
      comment: 'parent 5 comment4_2',
    };
    const response = await request(server).post('/add-comment').send(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body.data).toBe('object');
  });

  test('GET /list-comments should return status 200', async () => {
    const response = await request(server).get('/list-comments/1');
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(typeof response.body.data).toBe('object');
  });
});
