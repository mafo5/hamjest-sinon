'use strict';

const _ = require('lodash');
const { asMatcher } = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const SinonMatcher = require('./SinonMatcher');

function IsFunctionWasCalledWith(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
	return _.create(new SinonMatcher(), {
		matchesSafely: function (actual) {
			const callResults = this.getCallResults(actual, matchers);
			return promiseAgnostic.matchesAggregate(callResults, _.some);
		},
		describeTo: function (description) {
			description
				.append('a function walled with ')
				.appendList('[', ', ', ']', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const results = this.getCallResults(actual, matchers);
			description.append('function was called with:');
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				const callArgs = actual.args[index];
				description.append('\n');
				description.indented(() => {
					description
						.append('(')
						.append(index + 1)
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
