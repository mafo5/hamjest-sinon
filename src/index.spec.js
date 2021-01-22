'use strict';

const assert = require('assert');
const _ = require('lodash');

describe('hamjest', () => {
	let sut;
	beforeEach(() => {
		delete require.cache[require.resolve('hamjest')];
		delete require.cache[require.resolve('./index')];
		sut = require('hamjest');
	});

	describe('without plugin', () => {
		it('should not contains wasCalled', () => {
			assert.equal(_.isUndefined(sut.wasCalled), true, 'wasCalled known to hamjest');
		});
	});

	describe('with plugin', () => {
		beforeEach(() => {
			require('./index');
		});

		it('should contains wasCalled', () => {
			assert.equal(_.isUndefined(sut.wasCalled), false, 'wasCalled not known to hamjest');
		});
	});
});
