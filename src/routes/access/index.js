const express = require("express");
const accessController = require("../../controllers/access.controller");
const { createAsyncHandler } = require("../../auth/errorUtils");
const router = express.Router();

router.post("/shop/signup", createAsyncHandler(accessController.signup));

module.exports = router;
