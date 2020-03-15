'use strict';

const _ = require('lodash');
const { TypeSafeMatcher, asMatcher } = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const getType = require('hamjest/lib/utils/getType');

module.exports = function (valueOrMatcher) {
    const matcher = asMatcher(valueOrMatcher);
    function getCallCount(sinonMock) {
        return _.size(sinonMock.args);
    }
    function isSinonMock(sinonMock) {
        return _.isFunction(sinonMock) && _.isArray(sinonMock.args);
    }
	return _.create(new TypeSafeMatcher(), {
		isExpectedType: isSinonMock,
		matchesSafely: function (actual) {
            const callCount = getCallCount(actual);
			return matcher.matches(callCount);
		},
		describeTo: function (description) {
			description
				.append('a function called ')
				.appendDescriptionOf(matcher)
				.append(' times');
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
			const callCount = getCallCount(actual);
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
