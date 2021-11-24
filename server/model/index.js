const client = require('./../db/postgres/');

module.exports = {

  getQuestions: async ({product_id, page=0, count=5}) => {
    try {
      const results =  await client.query(
        `SELECT question_id, question_body, question_date,
        asker_name, question_helpfulness, reported
        FROM questions WHERE product_id = ${product_id}
        OFFSET ${page} FETCH NEXT ${count} ROWS ONLY`);
      return results.rows
    } catch (error) {
      return error;
    }
  },

  getAnswers: async (qid, page=0, count=5) => {
    try {
      const results = await client.query(
      `SELECT answer_id, answer_date, answer_body,
       answerer_name, answer_helpfulness, reported
       FROM answers WHERE question_id=${qid}
       OFFSET ${page} FETCH NEXT ${count} ROWS ONLY`);
       console.log(results)
       return results.rows;
    } catch (error) {
      return error;
    }
  },

  getPhotos: async (answerID) => {
    try {
      const results = await client.query(
        `SELECT COALESCE (json_agg(json_build_object('id', photo_id, 'url', url))
         FILTER (WHERE url IS NOT NULL), '[]') AS photos from photos
         WHERE answer_id=${answerID}
         GROUP BY answer_id`);
      return results.rows;
    } catch (error) {
      return error;
    }
  },

  addQuestion: async ({question_body, asker_name, asker_email, product_id}) =>  {
    try {
      const result  = await client.query(`INSERT INTO questions (question_body, asker_name, asker_email, product_id) VALUES (${question_body}, ${asker_name}, ${asker_email}, ${product_id})`);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
