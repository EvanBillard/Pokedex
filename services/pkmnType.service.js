const PkmnType = require("../models/pkmnType.model");

const getAllTypes = () => {
  return {
    data: PkmnType,
    count: PkmnType.length
  };
};

module.exports = { getAllTypes };
