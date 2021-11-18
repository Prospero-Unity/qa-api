const router = require('express').Router();
const controller = require('./controller');

router.get('/api/products/questions', controller.get);

module.exports = router;