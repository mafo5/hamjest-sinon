'use strict';

const _ = require('lodash');
const { TypeSafeMatcher, asMatcher } = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const getType = require('hamjest/lib/utils/getType');

function IsFunctionWasCalledWith(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
    function isSinonMock(sinonMock) {
        return _.isFunction(sinonMock) && _.isArray(sinonMock.args);
	}
	function getCallResults(calls) {
		return _.map(calls, (callArgs) => {
			const matcherResults = _.map(matchers, (matcher, index) => {
				return matcher.matches(callArgs[index]);
			});
			return promiseAgnostic.matchesAggregate(matcherResults, _.every);
		});
	}
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: isSinonMock,
		matchesSafely: function (actual) {
			const callResults = getCallResults(actual.args);
			return promiseAgnostic.matchesAggregate(callResults, _.some);
		},
		describeTo: function (description) {
			description
				.append('a function walled with ')
				.appendList('[', ', ', ']', matchers);
		},
		describeMismatch: function (actual, description) {
			if (!this.isExpectedType(actual)) {
				if (!actual) {
					description.append('was ')
						.appendValue(actual);
					return;
				}
                if (_.isFunction(actual)) {
                    description
                        .append('was a ')
                        .append(getType(actual))
                        .append(' without a mock');
                    return;
                }
				description
					.append('was a ')
					.append(getType(actual))
					.append(' (')
					.appendValue(actual)
					.append(')');
			} else {
				return this.describeMismatchSafely(actual, description);
			}
		},
		describeMismatchSafely: function (actual, description) {
			const results = getCallResults(actual.args);
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
