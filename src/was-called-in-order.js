'use strict';

const _ = require('lodash');
const {asMatcher} = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const SinonMatcher = require('./SinonMatcher');

function asSelfDescribing(value) {
	if (!value || !_.isFunction(value.describeTo)) {
		return {
			describeTo(description) {
				description.appendValue(value);
			}
		};
	} else {
		return value;
	}
}

function IsFunctionWasCalledInOrder(itemsOrMatchers) {
	const matchers = _.map(itemsOrMatchers, asMatcher);
	function getCallResults(sinonMock, matchers) {
		const callArgs = sinonMock.args;
		return _.map(matchers, (matcher, index) => {
			return matcher.matches(callArgs[index]);
		});
	}
	return _.create(new SinonMatcher(), {
		matchesSafely: function (actual) {
			if (actual.args.length !== matchers.length) {
				return false;
			}
			const callResults = getCallResults(actual, matchers);
			return promiseAgnostic.matchesAggregate(callResults, _.every);
		},
		describeTo: function (description) {
			description.appendList('a function called in order with args ', ', ', '', matchers);
		},
		describeMismatchSafely: function (actual, description) {
			const callArgs = actual.args;
			const results = getCallResults(actual, matchers);

			let first = true;
			return promiseAgnostic.describeMismatchAggregate(results, (result, index) => {
				if (result || matchers.length <= index || callArgs.length <= index) {
					return;
				}
                
				first = false;

				description
					.append('call ')
					.append(index)
					.append(': ');
				return matchers[index].describeMismatch(callArgs[index], description);
			}, () => {
				if (!first) {
					description.append('\n');
				}
				if (callArgs.length > matchers.length) {
					const list = callArgs.slice(matchers.length);
					description.append('not matched:');
					description.indented(() => {
						list.forEach((value, index) => {
							description.append(`\ncall ${matchers.length + index}: `);
							description.appendDescriptionOf(asSelfDescribing(value));
						});
					});
				} else if (callArgs.length < matchers.length) {
					const list = matchers.slice(callArgs.length);
					description.append('missing:');
					description.indented(() => {
						list.forEach((value, index) => {
							description.append(`\ncall ${callArgs.length + index}: `);
							description.appendDescriptionOf(asSelfDescribing(value));
						});
					});
				}
			});
		}
	});
}

IsFunctionWasCalledInOrder.wasCalledInOrder = function () {
	return new IsFunctionWasCalledInOrder(arguments);
};

module.exports = IsFunctionWasCalledInOrder;