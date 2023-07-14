'use strict';

const isFunction = require('lodash/isFunction');
const create  = require('lodash/create');
const size = require('lodash/size');
const isArray = require('lodash/isArray');
const {TypeSafeMatcher} = require('hamjest');
const getType = require('./getType');
const {isObject} = require('lodash');

function MockMatcher() {
	function isSinonMock(sinonMock) {
		return isFunction(sinonMock) && isArray(sinonMock.args);
	}
	function isJestMock(jestMock) {
		return !!jestMock && isObject(jestMock.mock) && isArray(jestMock.mock.calls);
	}
	function isExpectedType(mock) {
		return isSinonMock(mock) || isJestMock(mock);
	}
	function getCallCount(mock) {
		if (isJestMock(mock)) {
			return mock && mock.mock && size(mock.mock.calls) || 0;
		}
		if (isSinonMock(mock)) {
			return mock && size(mock.args) || 0;
		}
		return 0;
	}
	function getAllCallArgs(mock) {
		if (isJestMock(mock)) {
			return mock && mock.mock && mock.mock.calls || [];
		}
		if (isSinonMock(mock)) {
			return mock && mock.args || [];
		}
		return [];
	}
	return create(new TypeSafeMatcher(), {
		getCallCount: getCallCount,
		getAllCallArgs: getAllCallArgs,
		isExpectedType: isExpectedType,
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

module.exports = MockMatcher;
