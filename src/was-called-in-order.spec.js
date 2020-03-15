'use strict';

const __ = require('hamjest');
const sinon = require('sinon');

const { wasCalledInOrder } = require('./was-called-in-order');

describe('IsFunctionWasCalledInOrder', () => {

	describe('wasCalledInOrder', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalledInOrder(__.contains(__.containsString('expected')), __.hasSize(1));
		});

		it('should match if all matchers match in order', () => {
            const mock = sinon.stub();
            mock('expected');
            mock(7);
			__.assertThat(sut.matches(mock), __.is(true));
		});

		it('should not match if there are too many items', () => {
            const mock = sinon.stub();
            mock('expected');
            mock(7);
            mock(7);
			__.assertThat(sut.matches(mock), __.is(false));
		});

		it('should not match if items are missing', () => {
            const mock = sinon.stub();
			__.assertThat(sut.matches(mock), __.is(false));
            mock('expected');
			__.assertThat(sut.matches(mock), __.is(false));
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

				__.assertThat(description.get(), __.equalTo('a function called in order with args [a string containing "expected"], a collection or string with size <1>'));
			});

			it('should contain all mismatches', () => {
                const mock = sinon.stub();
                mock(5);
                mock(6, 2);
                mock(7);

				sut.describeMismatch(mock, description);

				__.assertThat(description.get(), __.equalTo('call 0: item 0: was a Number (<5>)\ncall 1: size was <2>\nfor [<6>, <2>]\nnot matched:\n\tcall 2: [<7>]'));
			});

			it('should contain surplus items', () => {
                const mock = sinon.stub();
                mock('expected');
                mock(7);
                mock('surplus 1');
                mock(100);

				sut.describeMismatch(mock, description);

				__.assertThat(description.get(), __.equalTo('not matched:\n\tcall 2: ["surplus 1"]\n\tcall 3: [<100>]'));
			});

			it('should contain unmatched matchers', () => {
                const mock = sinon.stub();

				sut.describeMismatch(mock, description);

				__.assertThat(description.get(), __.equalTo('missing:\n\tcall 0: [a string containing "expected"]\n\tcall 1: a collection or string with size <1>'));
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