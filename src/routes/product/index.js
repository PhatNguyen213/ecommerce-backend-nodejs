const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

router.get(
  "/search/:keySearch",
  createAsyncHandler(ProductController.searchProduct),
);

router.use(authentication);

router.get("/drafts/all", createAsyncHandler(ProductController.getAllDraft));
router.get(
  "/published/all",
  createAsyncHandler(ProductController.getAllPublished),
);

router.post("", createAsyncHandler(ProductController.createProduct));
router.post(
  "/publish/:id",
  createAsyncHandler(ProductController.publishProduct),
);
router.post(
  "/unpublish/:id",
  createAsyncHandler(ProductController.unPublishProduct),
);

module.exports = router;
