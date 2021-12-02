const { Pool } = require('pg');

module.exports = new Pool({
  host: "3.144.207.215",
  user: "eric",
  password: "1234",
  database: "sdc",
  port: "5432"
});
