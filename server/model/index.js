const client = require('./../db/postgres/');

module.exports = {

  getQuestions: async ({product_id, page, count}) => {
    return await client.query(`SELECT question_id, product_id, question_body, question_date, asker_name, question_helpfulness, reported FROM questions WHERE product_id = ${product_id} LIMIT ${count}`)
      .then(results =>  results.rows)
      .catch(error => error)
  },

  getAnswers: async (qid) => {
    return await client.query(
      `SELECT
        answers.answer_id, answer_date,
        answer_body, answerer_name, answer_helpfulness,
        COALESCE (json_agg(json_build_object('id', photo_id, 'url', photos.url))
        FILTER (WHERE photos.url IS NOT NULL), '[]') AS photos
      FROM answers
      LEFT   JOIN photos
      ON photos.answer_id = answers.answer_id
      WHERE answers.question_id = ${qid}
      GROUP BY answers.answer_id
      LIMIT 5`)
        .then(results => {
          return results.rows;
        })
        .catch(error => {
          console.log('err')
          return error;
        })
  }
}
