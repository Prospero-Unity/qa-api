const express = require('express');
const client = require('./../db/postgres/');

module.exports = {
  getAll: async () => {
    const res = await client.query('SELECT * FROM questions LIMIT 5');
    return res.rows;
  }
}
