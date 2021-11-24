const model = require('./../model');

async function queryAnswers(qid, page, count) {

  const answers = {}
  const answerResults = await model.getAnswers(qid, page, count)
                          .then(results => results).catch(error => error);

  for (let answer of answerResults) {
    const answerID = answer.answer_id;
    const obj = {}
    obj.id = answerID;
    obj.body = answer.answer_body;
    obj.date = answer.answer_date;
    obj.answerer_name = answer.answerer_name;
    obj.helpfulness = answer.answer_helpfulness
    obj.photos = await model.getPhotos(answerID)
                   .then(([photos]) => {
                     return photos ? photos.photos : []
                   })
                   .catch(error => error);
    answers[answerID] = obj;
  }
  return answers;
}

module.exports = {

  getQuestions: async (req, res) => {
    try {
      let obj = {};
      obj.product_id = req.query.product_id;
      obj.results = await model.getQuestions(req.query)
        .then((results) => {return results})
        .catch(error => error);
        for (let question of obj.results) {
          question.answers = await queryAnswers(question.question_id);
      }
      res.set('Cache-Control', 'public', 'max-age=604800');
      res.send(obj);
    } catch(error) {
      res.status(500).send(error)
    }
  },

  getAnswers: async (req, res) => {
    try {
      res.set('Cache-Control', 'public', 'max-age=604800');
      res.send(await queryAnswers(req.params.question_id, req.query.page, req.query.count));
    } catch (error) {
      res.status(500).send(error);
    }
  }
}