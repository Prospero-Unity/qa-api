'use strict'


const generateRandomNumber = (upperBound) => {
  return Math.floor(Math.random() * upperBound);
}

module.exports.generateProductID = (context, events, done) => {
  context.vars.product_id = generateRandomNumber(5000);
  done();
}

module.exports.generateAnswerParams = (context, events, done) => {
  const placeHolderLinks = ['https://fillmurray.com/200/300', 'http://placecorgi.com/260/180'];
  context.vars.question_id = generateRandomNumber(3000000) + 1;
  context.vars.photos = placeHolderLinks.slice(0, generateRandomNumber(2));
  done();
}