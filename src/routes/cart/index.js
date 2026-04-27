const express = require("express");
const { createAsyncHandler } = require("../../auth/errorUtils");
const { authentication } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authentication);

router.post("/update", createAsyncHandler(CartController.update));
router.post("", createAsyncHandler(CartController.addToCart));
router.delete("", createAsyncHandler(CartController.delete));
router.get("", createAsyncHandler(CartController.listCart));

module.exports = router;
