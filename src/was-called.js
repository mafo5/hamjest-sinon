'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const { Matcher, promiseAgnostic, asMatcher, greaterThan } = require('hamjest');

function WasCalled(callMatcher = greaterThan(0), matchers) {
    callMatcher = asMatcher(callMatcher);

    function isStub(actual) {
        return actual && typeof actual === 'function' && actual.args;
    }

	return _.create(new Matcher(), {
		matches: function (actual) {

            if (!isStub(actual)) {
                return false;
            }

            if (!callMatcher) {
                return actual.args.length > 0;
            }

            return callMatcher.matches(actual.args.length);
		},
		describeTo: function (description) {
            description.append('a function called ');
            callMatcher.describeTo(description);
            description.append(' times');
		},
		describeMismatch: function (actual, description) {
            if (typeof actual !== 'function') {
                description.append('was not a function');
                return;
            }
            if (!isStub(actual)) {
                description.append('was not a sinon stub to be messured');
                return;
            }
            if (!callMatcher && actual.args.length === 0) {
                description.append('was not called');
                return;
            }
            description.append('function called ');
            if (callMatcher.describeMismatch) {
                callMatcher.describeMismatch(actual.args.length, description);
            } else {
                callMatcher.describeTo(description);
            }
            description.append(' times');
		}
	});
}

WasCalled.wasCalled = function (callCount, matcher) {
	return new WasCalled(callCount, matcher);
};

module.exports = WasCalled;
