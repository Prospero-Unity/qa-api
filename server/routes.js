const router = require('express').Router();
const controller = require('./controller');

router.get('/api/questions', controller.get);

module.exports = router;