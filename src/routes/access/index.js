const express = require("express");
const accessController = require("../../controllers/access.controller");
const { createAsyncHandler } = require("../../auth/errorUtils");
const router = express.Router();

router.post("/shop/signup", createAsyncHandler(accessController.signup));
router.post("/shop/login", createAsyncHandler(accessController.login));

module.exports = router;
