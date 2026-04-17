"use strict";

const _ = require("lodash");

const getData = (fields = [], object) => _.pick(object, fields);

const getSelectData = (select = []) =>
  Object.fromEntries(select.map((el) => [el, 1]));

const getUnSelectData = (unselect = []) =>
  Object.fromEntries(unselect.map((el) => [el, 0]));

const removeUndefinedProperties = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObject = (obj, final = {}, parentField) => {
  return Object.keys(obj).reduce((accumulator, currentKey) => {
    const key = parentField ? `${parentField}.${currentKey}` : currentKey;
    if (typeof obj[currentKey] !== "object") {
      accumulator[key] = obj[currentKey];
    } else {
      updateNestedObject(obj[currentKey], final, currentKey);
    }
    return accumulator;
  }, final);
};

module.exports = {
  getData,
  getSelectData,
  getUnSelectData,
  removeUndefinedProperties,
  updateNestedObject,
};
