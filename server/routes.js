const router = require('express').Router();
const controller = require('./controller');

router.get('/qa/questions/', controller.getQuestions);
router.get('/qa/questions/:question_id/answers', controller.getAnswers);
router.post('/qa/questions', controller.addQuestion);
router.post('/qa/questions/:question_id/answers', controller.addAnswer);
router.put('/qa/questions/:question_id/helpful', controller.markQuestionHelpful);
router.put('/qa/questions/:answer_id/helpful', controller.markAnswerHelpful);

module.exports = router;