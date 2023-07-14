'use strict';
/**
 * Copy & Own from hamjest/lib/utils/getTypeName.js because is not exposed
 */

module.exports = function getName(type) {
	if (!type.name) {
		return 'ANONYMOUS FUNCTION';
	}

	return type.name;
};