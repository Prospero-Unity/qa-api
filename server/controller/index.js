const model = require('./../model');

module.exports = {

  getQuestions: async (req, res) => {
    res.send(await model.getQuestions());
  },

  getAnswers: async (req, res) => {
    res.send(await model.getAnswers())
  }
}