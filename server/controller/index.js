const model = require('./../model');

module.exports = {

  getQuestions: async (req, res) => {
    try {
      let obj = {};
      obj.product_id = req.query.product_id;
      const results = await model.getQuestions(req.query);
      obj.results = results;
      for (let question of obj.results) {
        question.answers = await model.getAnswers(question.question_id);
      }
      res.setHeader('Cache-Control', 'public', 'max-age=604800');
      res.send(obj);
    } catch(error) {
      res.status(500).send(error)
    }
  },

  getAnswers: async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'public', 'max-age=604800');
      res.send(await model.getAnswers(req.params.question_id, req.query.page, req.query.count));
    } catch (error) {
      res.status(500).send(error);
    }
  },

  addQuestion: async (req, res) => {
    try {
      await(model.addQuestion(req.body));
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}