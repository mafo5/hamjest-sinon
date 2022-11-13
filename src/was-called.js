'use strict';

const create = require('lodash/create');
const {asMatcher, greaterThan} = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const MockMatcher = require('./MockMatcher');

module.exports = function (valueOrMatcher) {
	if (valueOrMatcher === undefined) {
		valueOrMatcher = greaterThan(0);
	}
	const matcher = asMatcher(valueOrMatcher);
	return create(new MockMatcher(), {
		matchesSafely: function (actual) {
			const callCount = this.getCallCount(actual);
			return matcher.matches(callCount);
		},
		describeTo: function (description) {
			description
				.append('a function called ')
				.appendDescriptionOf(matcher)
				.append(' times');
		},
		describeMismatchSafely: function (actual, description) {
			const callCount = this.getCallCount(actual);
			return promiseAgnostic
				.describeMismatch(
					matcher.matches(callCount),
					() => {
						description
							.append('function called ');
						return matcher.describeMismatch(callCount, description);
					},
					() => {
						description
						.append(' times');
					}
				);
		}
	});
};
