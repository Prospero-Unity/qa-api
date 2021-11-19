const router = require('express').Router();
const controller = require('./controller');

router.get('/api/questions', controller.getQuestions);
router.get('/api/questions/answers', controller.getAnswers);

module.exports = router;