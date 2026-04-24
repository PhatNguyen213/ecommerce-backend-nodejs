const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post(
  "/amount",
  createAsyncHandler(DiscountController.getDiscountAmount),
);
router.get(
  "/list_product_code",
  createAsyncHandler(DiscountController.getAllDiscountCodesWithProducts),
);

router.use(authentication);

router.post("", createAsyncHandler(DiscountController.createDiscountCode));
router.get("", createAsyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;
