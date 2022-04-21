'use strict';

const isFunction = require('lodash/isFunction');
const create  = require('lodash/create');
const size = require('lodash/size');
const isArray = require('lodash/isArray');
const {TypeSafeMatcher} = require('hamjest');
const getType = require('hamjest/lib/utils/getType');

function SinonMatcher() {
	function isSinonMock(sinonMock) {
		return isFunction(sinonMock) && isArray(sinonMock.args);
	}
	function getCallCount(sinonMock) {
		return sinonMock && size(sinonMock.args) || 0;
	}
	return create(new TypeSafeMatcher(), {
		getCallCount: getCallCount,
		isExpectedType: isSinonMock,
		describeMismatch: function (actual, description) {
			if (!this.isExpectedType(actual)) {
				if (!actual) {
					description.append('was ')
						.appendValue(actual);
					return;
				}
				if (isFunction(actual)) {
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
