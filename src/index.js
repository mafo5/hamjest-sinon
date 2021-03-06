'use strict';

const _ = require('lodash');

const SinonMatcher = require('./SinonMatcher');
const wasCalled = require('./was-called');
const {wasCalledWith} = require('./was-called-with');
const {wasCalledInOrder} = require('./was-called-in-order');

function extendHamjest(hamjest) {
	_.extend(hamjest, {SinonMatcher, wasCalled, wasCalledWith, wasCalledInOrder});
}

const __ = require('hamjest');
extendHamjest(__);

module.exports = {SinonMatcher, wasCalled, wasCalledWith, wasCalledInOrder, extendHamjest};
