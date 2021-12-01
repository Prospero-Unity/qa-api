const router = require('express').Router();
const controller = require('./controller');

router.get('/qa/questions/', controller.getQuestions);
router.get('/qa/questions/:question_id/answers', controller.getAnswers);
router.get('/loaderio-f4c20886578f17a9434bec988399bb5e', (req, res) => {
	res.send('loaderio-f4c20886578f17a9434bec988399bb5e');
}); 
router.post('/qa/questions', controller.addQuestion);
router.post('/qa/questions/:question_id/answers', controller.addAnswer);
router.put('/qa/questions/:question_id/helpful', controller.markQuestionHelpful);
router.put('/qa/answers/:answer_id/helpful', controller.markAnswerHelpful);
router.put('/qa/questions/:question_id/report', controller.reportQuestion);
router.put('/qa/answers/:answer_id/report', controller.reportAnswer);

module.exports = router;
