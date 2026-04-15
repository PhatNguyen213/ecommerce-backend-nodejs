const { product } = require("../product.model");
const { Types } = require("mongoose");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProduct = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  console.log("mo", modifiedCount);

  return modifiedCount;
};

const unPublishProduct = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundProduct) return null;

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);

  console.log("mo", modifiedCount);

  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);

  const results = await product
    .find(
      { isPublished: true, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

module.exports = {
  queryProduct,
  publishProduct,
  unPublishProduct,
  searchProductByUser,
};
