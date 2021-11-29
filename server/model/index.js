const pool = require('./../db/postgres/');

async function getPhotos(answerID) {
  try {
    const results = await pool.query(`
      SELECT COALESCE (json_agg(json_build_object('id', photo_id, 'url', url))
      FILTER (WHERE url IS NOT NULL), '[]') AS photos from photos
      WHERE answer_id=${answerID}
      GROUP BY answer_id
    `);
    return results.rows[0] ? results.rows[0].photos : [];
  } catch (error) {
    return error;
  }
}

async function queryAnswers(qid, page=0, count=5) {
  try {
    const answers = {};
    const results = await pool.query(`
      SELECT answer_id, answer_date, answer_body,
      answerer_name, answer_helpfulness, reported
      FROM answers WHERE question_id=${qid}
      OFFSET ${page} FETCH NEXT ${count} ROWS ONLY
    `);
    for (let answer of results.rows) {
      const obj = {};
      const answerID = answer.answer_id;
      obj.id = answerID;
      obj.body = answer.answer_body;
      obj.date = new Date(answer.answer_date).toISOString();
      obj.answerer_name = answer.answerer_name;
      obj.helpfulness = answer.answer_helpfulness;
      const photos = await getPhotos(answerID);
      obj.photos = photos;
      answers[answerID] = obj;
    }
    return answers;
  } catch (error) {
    return error;
  }
}

module.exports = {

  getQuestions: async ({product_id, page=0, count=5}) => {
    try {
      const questions = {};
      const results = await pool.query(`
        SELECT question_id, question_body, question_date,
        asker_name, question_helpfulness, reported
        FROM questions WHERE product_id = ${product_id}
        OFFSET ${page} FETCH NEXT ${count} ROWS ONLY
      `);
      questions.product_id = product_id;
      questions.results = results.rows;
      for (let question of questions.results) {
        question.question_date = new Date(question.question_date).toISOString()
        question.answers = await queryAnswers(question.question_id);
      }
      return questions;
    } catch (error) {
      return error;
    }
  },

  getAnswers: (qid, page, count) => {
    try {
      const answers = queryAnswers(qid, page, count);
      return answers;
    } catch (error) {
      return error;
    }
  },

  addQuestion: async ({question_body, asker_name, asker_email, product_id}) =>  {
    try {
      await pool.query(`
        INSERT INTO questions (
          question_body, asker_name, asker_email, product_id, question_date
        )
        VALUES (
          '${question_body}', '${asker_name}', '${asker_email}',
           ${product_id}, ${Math.floor(new Date().getTime())}
        )
      `);
    } catch (error) {
      return error;
    }
  },

  addAnswer: async (qid, {answer_body, answerer_name, answerer_email, photos}) => {
    try {
      const answerResult = await pool.query(`
        INSERT INTO answers(question_id, answer_body, answerer_name, answerer_email, answer_date)
        VALUES('${qid}', '${answer_body}', '${answerer_name}',
        '${answerer_email}', ${Math.floor(new Date().getTime())})
        RETURNING answer_id
      `);
      const answerID = answerResult.rows[0].answer_id;
      for (let url of photos) {
        await pool.query(`
          INSERT INTO photos(answer_id, url)
          VALUES('${answerID}', '${url}')
        `);
      }
    } catch (error) {
      return error;
    }
  },

  markQuestionHelpful: async (id) => {
    try {
      const response = await pool.query(`
        UPDATE questions
        SET question_helpfulness = question_helpfulness + 1
        WHERE question_id=${id}
    `);
    if (response instanceof Error) {
      throw resposne;
    } else {
      return response
    }
    } catch (error) {
      return error;
    }
  },

  markAnswerHelpful: async (id) => {
    try {
      await pool.query(`
        UPDATE answers
        SET answer_helpfulness = answer_helpfulness + 1
        WHERE answer_id=${id}
    `);
    } catch (error) {
      return error;
    }
  }
}
