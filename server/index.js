const express = require('express');
const morgan = require('morgan');
const routes = require('./routes.js');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

// test connection
app.get('/api/products/questions/', (req, res) => {
  console.log('hello!')
  res.send('Received');
});

app.listen(3000, () => {
  console.log('listening on port 3000...')
});