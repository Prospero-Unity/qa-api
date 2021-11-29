const model = require('./../model');

module.exports = {

  getQuestions: async (req, res) => {
    try {
      const questions = await model.getQuestions(req.query);
      if (questions instanceof Error) {
        throw questions;
      } else {
        res.setHeader('Cache-Control', 'public', 'max-age=604800');
        res.send(questions);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getAnswers: async (req, res) => {
    try {
      const answers = await model.getAnswers(
        req.params.question_id,
        req.query.page,
        req.query.count
      );
      if (answers instanceof Error) {
        throw answers;
      } else {
        res.setHeader('Cache-Control', 'public', 'max-age=604800');
        res.send(answers);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  addQuestion: async (req, res) => {
    try {
      const response = await(model.addQuestion(req.body));
      if (response instanceof Error) {
        throw response;
      } else {
        res.sendStatus(201);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  addAnswer: async (req, res) => {
    try {
      const response = await(model.addAnswer(req.params.question_id, req.body));
      if (response instanceof Error) {
        throw response;
      } else {
        res.sendStatus(201);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}