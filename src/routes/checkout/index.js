const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const router = express.Router();

router.use(authentication);

router.post("/review", createAsyncHandler(CheckoutController.checkoutReview));

module.exports = router;
