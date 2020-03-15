'use strict';

const _ = require('lodash');
const __ = require('hamjest');
const sinon = require('sinon');

const SinonMatcher = require('./SinonMatcher');

describe('SinonMatcher', () => {
	let sut;

	beforeEach(() => {
		sut = _.create(new SinonMatcher(), {
			machesSafely: () => {
				return false;
			}
		});
    });
    
    describe('isExpectedType', () => {
        it('should return true for sinon stub', () => {
            const mock = sinon.stub();

            __.assertThat(sut.isExpectedType(mock), __.is(true));
        });
        it('should return true for sinon spy', () => {
            const mock = sinon.spy();

            __.assertThat(sut.isExpectedType(mock), __.is(true));
        });
        it('should return true for sinon fake', () => {
            const mock = sinon.fake();

            __.assertThat(sut.isExpectedType(mock), __.is(true));
        });
        it('should return false for others', () => {
            __.assertThat(sut.isExpectedType(() => {}), __.is(false));
            __.assertThat(sut.isExpectedType(1), __.is(false));
            __.assertThat(sut.isExpectedType(''), __.is(false));
            __.assertThat(sut.isExpectedType({}), __.is(false));
            __.assertThat(sut.isExpectedType([]), __.is(false));
            __.assertThat(sut.isExpectedType(true), __.is(false));
        });
    });

	describe('description', () => {
		let description;
		beforeEach(() => {
			description = new __.Description();
		});

		it('should describe undefined as "undefined"', () => {

			sut.describeMismatch(undefined, description);

			__.assertThat(description.get(), __.equalTo('was undefined'));
		});

		it('should describe null as "null"', () => {

			sut.describeMismatch(null, description);

			__.assertThat(description.get(), __.equalTo('was null'));
		});

		it('should describe function as "a Function without a mock"', () => {

			sut.describeMismatch(() => {}, description);

			__.assertThat(description.get(), __.equalTo('was a Function without a mock'));
		});

		it('should describe a digit as "Number"', () => {

			sut.describeMismatch(1, description);

			__.assertThat(description.get(), __.equalTo('was a Number (<1>)'));
		});
    });
    
    describe('getCallCount', () => {
        it('should return the count of the calls', () => {
            const stub = sinon.stub();
            stub();
            __.assertThat(sut.getCallCount(stub), __.is(1));
        });
        it('should fallback to 9 for no args', () => {
            __.assertThat(sut.getCallCount({}), __.is(0));
            __.assertThat(sut.getCallCount(null), __.is(0));
        });
    });
    
    describe('getCallResults', () => {
        it('should return the matcher results per call', () => {
            const stub = sinon.stub();
            stub();
            stub('');
            stub('something');
            __.assertThat(sut.getCallResults(stub, [__.is('')]), __.is([false, true, false]));
        });
    });
});