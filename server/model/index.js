const client = require('./../db/postgres/');

async function getPhotos(answerID) {
  try {
    const results = await client.query(
      `SELECT COALESCE (json_agg(json_build_object('id', photo_id, 'url', url))
        FILTER (WHERE url IS NOT NULL), '[]') AS photos from photos
        WHERE answer_id=${answerID}
        GROUP BY answer_id`);
    return results.rows[0] ? results.rows[0].photos : [];
  } catch (error) {
    return error;
  }
}

module.exports = {

  getQuestions: async ({product_id, page=0, count=5}) => {
    try {
      const results = await client.query(
        `SELECT question_id, question_body, question_date,
        asker_name, question_helpfulness, reported
        FROM questions WHERE product_id = ${product_id}
        OFFSET ${page} FETCH NEXT ${count} ROWS ONLY`);
      return results.rows;
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

       const answers = {};
       for (let answer of results.rows) {
        const obj = {};
        const answerID = answer.answer_id;
        obj.id = answerID;
        obj.body = answer.answer_body;
        obj.date = answer.answer_date;
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
  },

  addQuestion: async ({question_body, asker_name, asker_email, product_id}) =>  {
    try {
      await client.query(
        `INSERT INTO questions
          (question_body, asker_name, asker_email, product_id)
         VALUES
           ('${question_body}', '${asker_name}', '${asker_email}', ${product_id})`);
    } catch (error) {
      return error;
    }
  }
}
