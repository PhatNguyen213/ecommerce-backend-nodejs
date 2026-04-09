const express = require("express");
const accessController = require("../../controllers/access.controller");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/shop/signup", createAsyncHandler(accessController.signup));
router.post("/shop/login", createAsyncHandler(accessController.login));

router.use(authentication);

router.post("/shop/logout", createAsyncHandler(accessController.logout));

module.exports = router;
