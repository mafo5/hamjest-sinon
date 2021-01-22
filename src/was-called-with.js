'use strict';

const _ = require('lodash');
const {asMatcher} = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const SinonMatcher = require('./SinonMatcher');

function IsFunctionWasCalledWith(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
	function getCallResults(sinonMock, matchers) {
		return _.map(sinonMock.args, (callArgs) => {
			if (callArgs.length !== matchers.length) {
				return false;
			}
			const matcherResults = _.map(matchers, (matcher, index) => {
				return matcher.matches(callArgs[index]);
			});
			return promiseAgnostic.matchesAggregate(matcherResults, _.every);
		});
	}
	return _.create(new SinonMatcher(), {
		matchesSafely: function (actual) {
			const callResults = getCallResults(actual, matchers);
			return promiseAgnostic.matchesAggregate(callResults, _.some);
		},
		describeTo: function (description) {
			description
				.append('a function called with ')
				.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			if (actual.args.length === 0) {
				description.append('function was not called');
				return description;
			}
			const results = getCallResults(actual, matchers);
			description.append('function was called with:');
			return promiseAgnostic.describeMismatchAggregate(results, (__result, index) => {
				const callArgs = actual.args[index];
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
