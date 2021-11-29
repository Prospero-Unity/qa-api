const model = require('./../model');

function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

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
      res.status(500).send(error);
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
      res.status(500).send(error);
    }
  },

  addQuestion: async (req, res) => {
    try {
      const response = await(model.addQuestion(req.body));
      if (response instanceof Error) {
        throw response;
      } else if (!isValidEmail(req.body.asker_email)) {
        throw new TypeError('Unprocessable Entity: Invalid Email');
      } else {
        res.sendStatus(201)
      }
    } catch (error) {
      if (error instanceof TypeError) {
        res.status(422).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  },

  addAnswer: async (req, res) => {
    try {
      const response = await(model.addAnswer(req.params.question_id, req.body));
      if (response instanceof Error) {
        throw response;
      } else if (!isValidEmail(req.body.answerer_email)) {
        throw new TypeError('Unprocessable Entity: Invalid Email');
      } else {
        res.sendStatus(201)
      }
    } catch (error) {
      if (error instanceof TypeError) {
        res.status(422).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  },

  markQuestionHelpful: async (req, res) => {
    try {
      const response = await model.markQuestionHelpful(req.params.question_id);
      if (response instanceof Error) {
        throw response;
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },

  markAnswerHelpful: async (req, res) => {
    try {
      const response = await model.markAnswerHelpful(req.params.answer_id);
      if (response instanceof Error) {
        throw response;
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },

  reportQuestion: async (req, res) => {
    try {
      const response = await model.reportQuestion(req.params.question_id);
      if (response instanceof Error) {
        throw response;
      } else {
        res.sendStatus(200);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}