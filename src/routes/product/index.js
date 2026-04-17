const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const router = express.Router();

router.get(
  "/search/:keySearch",
  createAsyncHandler(ProductController.searchProduct),
);

router.get("", createAsyncHandler(ProductController.findAllProducts));
router.get("/:product_id", createAsyncHandler(ProductController.findProduct));

router.use(authentication);

router.get("/drafts/all", createAsyncHandler(ProductController.getAllDraft));
router.get(
  "/published/all",
  createAsyncHandler(ProductController.getAllPublished),
);

router.post("", createAsyncHandler(ProductController.createProduct));
router.patch(
  "/:product_id",
  createAsyncHandler(ProductController.updateProduct),
);
router.post(
  "/publish/:id",
  createAsyncHandler(ProductController.publishProduct),
);
router.post(
  "/unpublish/:id",
  createAsyncHandler(ProductController.unPublishProduct),
);

module.exports = router;
