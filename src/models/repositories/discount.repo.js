"use strict";

const { getUnSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
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
    .select(getUnSelectData(select))
    .lean();

  return documents;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
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

module.exports = { findAllDiscountCodesUnselect, findAllDiscountCodesSelect };
