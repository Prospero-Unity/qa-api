const model = require('./../model');

async function queryAnswers(qid, page, count) {
  const answers = await model.getAnswers(qid)
    .then(results => results)
    .catch(error => error);
  for (let answer of answers) {
    const [photos] = await model.getPhotos(answer.answer_id)
      .then(photos => photos)
      .catch(error => error);
    photos ? answer.photos = photos.photos : answer.photos = [];
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
      console.log(error)
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