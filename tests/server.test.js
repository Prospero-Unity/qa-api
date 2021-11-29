const supertest = require('supertest');
const pool = require('./../server/db/postgres/')
const app = require('./../server/index.js');
const request = supertest(app);

/* UTIL */
async function generateRandomNumber(limit) {
  const response = await pool.query('SELECT COUNT(*) FROM questions');
  limit = limit || response.rows[0].count;
  return Math.floor(Math.random() * Number(limit));
}

describe('Questions testing module', () => {
  test('Meets an endpoint', async () => {
    for (let i = 0; i < 10; i++) {
      const productID = await generateRandomNumber();
      const response = await request.get(`/qa/questions/?product_id=${productID}`);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.headers['content-encoding']).toBe('gzip');
      expect(response.status).toBe(200);
    }
  });

  test('Sends errors for incorrect requests', async () => {
    const nonExistentRequests = ['/qa/', '/', '/qa/questions/product_id=520&page=0&count=10'];
    const invalidRequests = [
      '/qa/questions','/qa/questions/??',
      '/qa/questions/?product_isad=520&page=0&count=10',
      '/qa/questions/?product_id=520&page=fsa&count=10',
      '/qa/questions/?product_id=520&page=0&count=dgas',
    ];

    for (let req of nonExistentRequests) {
      const response = await request.get(req);
      expect(response.status).toBe(404);
    }

    for (let req of invalidRequests) {
      const response = await request.get(req);
      expect(response.status).toBe(500);
    }
  });

  test('Returns specified count of questions (or less)', async () => {

    let response = await request.get('/qa/questions/?product_id=5');
    expect(response.body.results.length).toBeLessThanOrEqual(5); // default

    for (let i = 0; i < 5; i++) {
      const productID = await generateRandomNumber(500);
      const page = await generateRandomNumber(5);
      const count = await generateRandomNumber(100);
      response = await request.get(`/qa/questions/?product_id=${productID}&page=${page}&count=${count}`);
      expect(response.body.results.length).toBeLessThanOrEqual(count);
    }
  });

  test('Successfully POSTs a question', async () => {
    const questions = [
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test",
        "asker_email": "test@test324.com",
        "question_body": "test question"
      },
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test test",
        "asker_email": "test@test324.com",
        "question_body": "test question pt 2"
      }
    ];

    for (let question of questions) {
      const response = await request.post('/qa/questions/').send(question);
      expect(response.status).toBe(201);
      expect(response.created).toBe(true);
    }
  });

  test('Sends an error for invalid emails POSTs a question', async () => {
    const questions = [
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test",
        "asker_email": "testtest324.com",
        "question_body": "test question"
      },
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test",
        "asker_email": "test@@test324.com",
        "question_body": "test question"
      },
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test",
        "asker_email": "test@test324",
        "question_body": "test question"
      },
      {
        "product_id": await generateRandomNumber(100),
        "asker_name": "test",
        "asker_email": "@test324.com",
        "question_body": "test question"
      }
    ]
    for (let question of questions) {
      const response = await request.post('/qa/questions/').send(question);
      expect(response.status).toBe(422);
      expect(response.created).toBe(false);
    }
  });
});

describe('Answers testing module', () => {

  test('Meets an endpoint', async () => {
    const response = await request.get('/qa/questions/34/answers');
    expect(response.status).toBe(200);
  });

  test('Successfully POSTS an answer', async () => {

    const answers = [
      {
        answer_body: 'Test Answer',
        answerer_name: 'Test',
        answerer_email: 'test@test.com',
        photos: []
      },
      {
        answer_body: 'Test Answer 2',
        answerer_name: 'Test Test',
        answerer_email: 'testTest@test2.com',
        photos: ['http://placecorgi.com/260/180']
      },
      {
        answer_body: 'Test Answer 3',
        answerer_name: 'Test Test Test',
        answerer_email: 'testTest@test3.com',
        photos: ['http://placecorgi.com/260/180', 'http://placecorgi.com/250']
      },
      {
        answer_body: 'Test Answer 4',
        answerer_name: 'Test Test Test Test',
        answerer_email: 'testTest@test4.com',
        photos: []
      }
    ];

    for (let answer of answers) {
      const qid = await generateRandomNumber();
      const response = await request.post(`/qa/questions/${qid}/answers`).send(answer);
      expect(response.status).toBe(201);
      expect(response.created).toBe(true);
    }
  });

  test('Sends errors for incorrect requests', async () => {

    const nonExistentRequests = [
      '/qa/', '/', '/qa/questions/answers',
    ];

    const invalidRequests = [
      '/qa/questions',
      '/qa/questions/f7ads/answers',
      '/qa/questions/5/answers?page=fsa&count=10',
      '/qa/questions/5/answers?page=0&count=dgas',
    ];

    for (let req of nonExistentRequests) {
      const response = await request.get(req);
      expect(response.status).toBe(404);
    }

    for (let req of invalidRequests) {
      const response = await request.get(req);
      expect(response.status).toBe(500);
    }
  });

});

