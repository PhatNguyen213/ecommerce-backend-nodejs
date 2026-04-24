"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");
const discountModel = require("../discount.model");

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort: aSort = "ctime",
  unSelect,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sort = aSort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort: aSort = "ctime",
  unSelect,
  filter,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sort = aSort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExists = async (filter) =>
  await discountModel.findOne(filter).lean();

module.exports = {
  findAllDiscountCodesUnselect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
