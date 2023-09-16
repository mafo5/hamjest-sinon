'use strict';

const create = require('lodash/create');
const __ = require('hamjest');
const jestMock = require('jest-mock');
const sinon = require('sinon');

const MockMatcher = require('./MockMatcher');

describe('MockMatcher', () => {
	let sut;

	beforeEach(() => {
		sut = create(new MockMatcher(), {
			machesSafely: () => {
				return false;
			}
		});
	});
    
	describe('isExpectedType', () => {
		[
			{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
			{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
			{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
			{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
		].forEach(({mockCreator, mockType}) => {
			it(`should return true for ${mockType}`, () => {
				const mock = mockCreator();

				__.assertThat(sut.isExpectedType(mock), __.is(true));
			});
		});
		it('should return false for others', () => {
			__.assertThat([
				sut.isExpectedType(() => {}),
				sut.isExpectedType(1),
				sut.isExpectedType(''),
				sut.isExpectedType({}),
				sut.isExpectedType([]),
				sut.isExpectedType(true),
			], __.everyItem(__.is(false)));
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
		[
			{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
			{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
			{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
			{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
		].forEach(({mockCreator, mockType}) => {
			it(`should return the count of the calls for ${mockType}`, () => {
				const mock = mockCreator();
				mock();
				__.assertThat(sut.getCallCount(mock), __.is(1));
			});
		});
		it('should fallback to 0 for no args', () => {
			__.assertThat([
				sut.getCallCount({}),
				sut.getCallCount(null),
			], __.everyItem(__.is(0)));
		});
	});
});