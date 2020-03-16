'use strict';

const __ = require('hamjest');
const sinon = require('sinon');

const { wasCalledWith } = require('./was-called-with');

describe('IsFunctionWasCalledWith', () => {

	describe('wasCalledWith', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalledWith(__.containsString('expected'), 7);
		});

		it('should match if all matchers match in order', () => {
            const stub = sinon.stub();
            stub(7, 'expected item');
			__.assertThat('wrong order', sut.matches(stub), __.is(false));
            stub('expected item', 7);
            __.assertThat('right order', sut.matches(stub), __.is(true));
		});

		it('should not match if there are too many items', () => {
            const stub = sinon.stub();
            stub('expected item', 7, 7);
			__.assertThat(sut.matches(stub), __.is(false));
		});

		it('should not match if items are missing', () => {
            const stub = sinon.stub();
            stub();
			__.assertThat(sut.matches(stub), __.is(false));
            stub('expected item');
			__.assertThat(sut.matches(stub), __.is(false));
		});

		it('should not match non-sinon-mocks', () => {
			__.assertThat(sut.matches(12), __.is(false));
			__.assertThat(sut.matches(new Date()), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
			__.assertThat(sut.matches({}), __.is(false));
			__.assertThat(sut.matches(() => {}), __.is(false));
			__.assertThat(sut.matches(true), __.is(false));
			__.assertThat(sut.matches(), __.is(false));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});

			it('should contain item description', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a function called with [a string containing "expected", <7>]'));
			});

			it('should contain all mismatches', () => {
                const stub = sinon.stub();
                stub('first');
                stub('second', 'call');

				sut.describeMismatch(stub, description);

				__.assertThat(description.get(), __.equalTo('function was called with:\n(0) ["first"]\n(1) ["second", "call"]'));
			});
	
			it('should fit for non-function', () => {
	
				sut.describeMismatch(7, description);
	
				__.assertThat(description.get(), __.equalTo('was a Number (<7>)'));
			});
	
			it('should fit for non-stub', () => {
	
				sut.describeMismatch(() => {}, description);
	
				__.assertThat(description.get(), __.equalTo('was a Function without a mock'));
			});
		});
	});
});
