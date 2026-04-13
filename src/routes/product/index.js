const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

router.use(authentication);

router.post("", createAsyncHandler(ProductController.createProduct));

module.exports = router;
