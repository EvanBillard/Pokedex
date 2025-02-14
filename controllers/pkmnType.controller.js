const { getAllTypes } = require("../services/pkmnType.service");

const getTypes = (req, res) => {
  res.json(getAllTypes());
};

module.exports = { getTypes };
