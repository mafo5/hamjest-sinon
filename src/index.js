'use strict';

const _ = require('lodash');

const SinonMatcher = require('./SinonMatcher');
const wasCalled = require('./was-called');
const { wasCalledWith } = require('./was-called-with');
const { wasCalledInOrder } = require('./was-called-in-order');

_.extend(require('hamjest'), { SinonMatcher, wasCalled, wasCalledWith, wasCalledInOrder });

module.exports = { SinonMatcher, wasCalled, wasCalledWith, wasCalledInOrder };
