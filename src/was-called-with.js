'use strict';

const create  = require('lodash/create');
const map = require('lodash/map');
const every = require('lodash/every');
const some = require('lodash/some');
const {asMatcher} = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const MockMatcher = require('./MockMatcher');

function IsFunctionWasCalledWith(itemsOrMatchers) {
	const matchers = map(itemsOrMatchers, asMatcher);
	function getCallResults(args, matchers) {
		return map(args, (callArgs) => {
			if (callArgs.length !== matchers.length) {
				return false;
			}
			const matcherResults = map(matchers, (matcher, index) => {
				return matcher.matches(callArgs[index]);
			});
			return promiseAgnostic.matchesAggregate(matcherResults, every);
		});
	}
	return create(new MockMatcher(), {
		matchesSafely: function (actual) {
			const callResults = getCallResults(this.getAllCallArgs(actual), matchers);
			return promiseAgnostic.matchesAggregate(callResults, some);
		},
		describeTo: function (description) {
			description
				.append('a function called with ')
				.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const allCallArgs = this.getAllCallArgs(actual);
			if (allCallArgs.length === 0) {
				description.append('function was not called');
				return description;
			}
			const results = getCallResults(allCallArgs, matchers);
			description.append('function was called with:');
			return promiseAgnostic.describeMismatchAggregate(results, (__result, index) => {
				const callArgs = allCallArgs[index];
				description.append('\n');
				description.indented(() => {
					description
						.append('(')
						.append(index)
						.append(') ')
						.appendList('[', ', ', ']', callArgs);
				});
					
				return description;
			});
		}
	});
}

IsFunctionWasCalledWith.wasCalledWith = function () {
	return new IsFunctionWasCalledWith(arguments);
};

module.exports = IsFunctionWasCalledWith;
