const client = require('./../db/postgres/');

module.exports = {

  getQuestions: async ({product_id, page=1, count=1}) => {
    return await client.query(
      `SELECT question_id, question_body, question_date,
       asker_name, question_helpfulness, reported
       FROM questions WHERE product_id = ${product_id}
       OFFSET ${page * count - count}
       LIMIT ${count}`)
      .then(results =>  results.rows)
      .catch(error => error)
  },

  getAnswers: async (qid, page=0, count=5) => {
    return await client.query(
      `SELECT answer_id, answer_date, answer_body, answerer_name, answer_helpfulness
       FROM answers WHERE question_id=${qid} LIMIT ${count}`)
      .then(results => results.rows)
      .catch(error =>  error);
  },

  getPhotos: async (answerID) => {
      return await client.query(
        `SELECT COALESCE (json_agg(json_build_object('id', photo_id, 'url', url))
         FILTER (WHERE url IS NOT NULL), '[]') AS photos from photos
         WHERE answer_id=${answerID}
         GROUP BY answer_id`)
      .then(results => results.rows)
      .catch(error => error)

  }
}
