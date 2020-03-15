'use strict';

const __ = require('hamjest');
const sinon = require('sinon');

const wasCalled = require('./was-called');

describe('wasCalled', () => {
	describe('with number', () => {
		let sut;
		beforeEach(() => {
			sut = wasCalled(__.greaterThan(2));
		});
	
		it('should match stub', () => {
			const stub = sinon.stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(true));
		});
	
		it('should match spy', () => {
			const stub = sinon.spy();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(true));
		});
	
		it('should match fake', () => {
			const stub = sinon.fake();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(true));
		});
	
		it('should not match other types', () => {
			__.assertThat(sut.matches(12), __.is(false));
			__.assertThat(sut.matches(new Date()), __.is(false));
			__.assertThat(sut.matches([]), __.is(false));
			__.assertThat(sut.matches({}), __.is(false));
			__.assertThat(sut.matches(() => {}), __.is(false));
			__.assertThat(sut.matches(true), __.is(false));
			__.assertThat(sut.matches(), __.is(false));
		});
	
		it('should wrap simple value in equalTo matcher', () => {
			sut = wasCalled(2);
			const stub = sinon.stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
			stub();
			__.assertThat(sut.matches(stub), __.is(true));
			stub();
			__.assertThat(sut.matches(stub), __.is(false));
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
	
			it('should contain mismatched value and size', () => {
	
				sut.describeMismatch(sinon.stub(), description);
	
				__.assertThat(description.get(), __.equalTo('function called was <0> times'));
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