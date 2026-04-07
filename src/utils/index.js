'use strict'

const _ = require('lodash')

const getData = (fields = [], object) => _.pick(object, fields)

module.exports = { getData }