"use strict";

const _ = require("lodash");

const getData = (fields = [], object) => _.pick(object, fields);

const getSelectData = (select = []) =>
  Object.fromEntries(select.map((el) => [el, 1]));

const getUnSelectData = (unselect = []) =>
  Object.fromEntries(unselect.map((el) => [el, 0]));

module.exports = { getData, getSelectData, getUnSelectData };
