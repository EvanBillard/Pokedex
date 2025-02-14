const express = require("express");
const { getTypes } = require("../controllers/pkmnType.controller");

const router = express.Router();

router.get("/types", getTypes);

module.exports = router;
