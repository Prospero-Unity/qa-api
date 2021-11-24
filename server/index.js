const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const routes = require('./routes.js');
const app = express();

app.use(morgan('dev'));
app.use(compression({
  threshold: 0,
  level: 9
}));
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log('listening on port 3000...')
});