const model = require('./../model');

module.exports = {
  get: async (req, res) => {
    res.send(await model.getAll());
  }
}