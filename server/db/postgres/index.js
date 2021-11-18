const { Pool, Client } = require('pg');

module.exports = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "eric"
});

