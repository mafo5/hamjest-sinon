'use strict';

const __ = require('hamjest');
const jestMock = require('jest-mock');
const sinon = require('sinon');

const {wasCalledWith} = require('./was-called-with');

describe('IsFunctionWasCalledWith', () => {
	describe('wasCalledWith', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalledWith(__.containsString('expected'), 7);
		});

		[
			{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
			{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
			{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
			{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
		].forEach(({mockCreator, mockType}) => {
			describe(`for ${mockType}`, () => {
				let mock;
				beforeEach(() => {
					mock = mockCreator();
				});
				it('should match if all matchers match in order', () => {
					mock(7, 'expected item');
					__.assertThat('wrong order', sut.matches(mock), __.is(false));
					mock('expected item', 7);
					__.assertThat('right order', sut.matches(mock), __.is(true));
				});

				it('should not match if there are too many items', () => {
					mock('expected item', 7, 7);
					__.assertThat(sut.matches(mock), __.is(false));
				});

				it('should not match if items are missing', () => {
					mock();
					__.assertThat(sut.matches(mock), __.is(false));
					mock('expected item');
					__.assertThat(sut.matches(mock), __.is(false));
				});
			});
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
			
			[
				{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
				{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
				{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
				{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
			].forEach(({mockCreator, mockType}) => {
				describe(`for ${mockType}`, () => {
					it('should contain all mismatches', () => {
						const mock = mockCreator();
						mock('first');
						mock('second', 'call');

						sut.describeMismatch(mock, description);

						__.assertThat(description.get(), __.equalTo('function was called with:\n(0) ["first"]\n(1) ["second", "call"]'));
					});
			
					it('should fit no calls', () => {
						const mock = mockCreator();

						sut.describeMismatch(mock, description);
			
						__.assertThat(description.get(), __.equalTo('function was not called'));
					});
				});
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
