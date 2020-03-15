'use strict';

const _ = require('lodash');
const { TypeSafeMatcher } = require('hamjest');
const promiseAgnostic = require('hamjest/lib/matchers/promiseAgnostic');
const getType = require('hamjest/lib/utils/getType');

function SinonMatcher() {
    function isSinonMock(sinonMock) {
        return _.isFunction(sinonMock) && _.isArray(sinonMock.args);
	}
    function getCallCount(sinonMock) {
        return sinonMock && _.size(sinonMock.args) || 0;
    }
	function getCallResults(sinonMock, matchers) {
		return _.map(sinonMock.args, (callArgs) => {
			const matcherResults = _.map(matchers, (matcher, index) => {
				return matcher.matches(callArgs[index]);
			});
			return promiseAgnostic.matchesAggregate(matcherResults, _.every);
		});
	}
	return _.create(new TypeSafeMatcher(), {
        getCallCount: getCallCount,
        getCallResults: getCallResults,
		isExpectedType: isSinonMock,
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
	});
}

module.exports = SinonMatcher;
