'use strict';

const __ = require('hamjest');
const jestMock = require('jest-mock');
const sinon = require('sinon');

const wasCalled = require('./was-called');

describe('wasCalled', () => {
	describe('with number', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalled(__.greaterThan(2));
		});
	
		[
			{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
			{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
			{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
			{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
		].forEach(({mockCreator, mockType}) => {
			it(`should match ${mockType}`, () => {
				const mock = mockCreator();
				const matches = [];
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				__.assertThat(matches, __.contains(false, false, false, true));
			});

			it(`should wrap simple value in equalTo matcher for ${mockType}`, () => {
				const mock = mockCreator();
				const matches = [];
				sut = wasCalled(2);
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				__.assertThat(matches, __.contains(false, false, true, false));
			});
		});
	
		it('should not match other types', () => {
			__.assertThat([
				sut.matches(12),
				sut.matches(new Date()),
				sut.matches([]),
				sut.matches({}),
				sut.matches(() => {}),
				sut.matches(true),
				sut.matches(),
			], __.everyItem(__.is(false)));
		});
	
		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});
	
			it('should contain matcher description', () => {
				sut.describeTo(description);
	
				__.assertThat(description.get(), __.equalTo('a function called a number greater than <2> times'));
			});
	
			[
				{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
				{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
				{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
				{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
			].forEach(({mockCreator, mockType}) => {
				it(`should contain mismatched value and size for ${mockType}`, () => {
					sut.describeMismatch(mockCreator(), description);
		
					__.assertThat(description.get(), __.equalTo('function called was <0> times'));
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

	describe('emtpy', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalled();
		});
	
		[
			{mockCreator: () => sinon.stub(), mockType: 'sinon stub'},
			{mockCreator: () => sinon.spy(), mockType: 'sinon spy'},
			{mockCreator: () => sinon.fake(), mockType: 'sinon fake'},
			{mockCreator: () => jestMock.fn(), mockType: 'Jest Mock'},
		].forEach(({mockCreator, mockType}) => {
			it(`should match ${mockType}`, () => {
				const mock = mockCreator();
				const matches = [];
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				mock();
				matches.push(sut.matches(mock));
				__.assertThat(matches, __.contains(false, true, true));
			});
		});
	
		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
			});
	
			it('should contain matcher description', () => {
				sut.describeTo(description);
	
				__.assertThat(description.get(), __.equalTo('a function called a number greater than <0> times'));
			});
		});
	});
});