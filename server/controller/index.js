const model = require('./../model');

module.exports = {

  getQuestions: (req, res) => {
    model.getQuestions(req.query)
      .then(async (questions) => {
        let answers = {}
        for (let question of questions) {
          let result = (await model.getAnswers(question.question_id));
          for (let answer of result) {
            answers[answer.answer_id] = answer;
          }
          question.answer = answers;
        }
        return questions;
      })
      .then(results => {
        res.send(results[0])
      })
      .catch(error => {
        res.status(500).send(error)
      });
  },

  getAnswers: (req, res) => {
    model.getAnswers(req.params.question_id)
      .then(results => {
        res.send(results);
      })
      .catch(error => {
        res.status(500).send(error)
      })
  }
}