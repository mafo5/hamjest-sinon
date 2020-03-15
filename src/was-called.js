'use strict';

const _ = require('lodash');
const { asMatcher } = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const SinonMatcher = require('./SinonMatcher');

module.exports = function (valueOrMatcher) {
    const matcher = asMatcher(valueOrMatcher);
	return _.create(new SinonMatcher(), {
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
