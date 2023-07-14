'use strict';

const extend = require('lodash/extend');

const MockMatcher = require('./MockMatcher');
const wasCalled = require('./was-called');
const {wasCalledWith} = require('./was-called-with');
const {wasCalledInOrder} = require('./was-called-in-order');

function extendHamjest(hamjest) {
	extend(hamjest, {MockMatcher, wasCalled, wasCalledWith, wasCalledInOrder});
}

// const __ = require('hamjest');
// extendHamjest(__);

const SinonMatcher = MockMatcher;

module.exports = {SinonMatcher, MockMatcher, wasCalled, wasCalledWith, wasCalledInOrder, extendHamjest};
