const client = require('./../db/postgres/');

module.exports = {

  getQuestions: async () => {
    const res = await client.query('SELECT * FROM questions LIMIT 5');
    return res.rows;
  },

  getAnswers: async() => {
    const res = await client.query('SELECT * FROM answers LIMIT 5');
    return res.rows;
  }

}
