'use strict';
/**
 * Copy & Own from hamjest/lib/utils/getType.js because is not exposed
 */

const getTypeName = require('./getTypeName');

module.exports = function (value) {
	if (!value.constructor) {
		return '<no type>';
	}
	return getTypeName(value.constructor);
};