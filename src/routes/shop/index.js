
const express = require("express");
const accessController = require("../../controllers/shop.controller");
const router = express.Router();

router.post("/shop/signup", accessController.signup);

module.exports = router;