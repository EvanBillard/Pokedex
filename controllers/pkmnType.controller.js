const { getAllTypes } = require("../services/pkmnType.service");

const getTypes = (req, res) => {
  let allT = getAllTypes();
  res.json(allT);
};

module.exports = { getTypes };
