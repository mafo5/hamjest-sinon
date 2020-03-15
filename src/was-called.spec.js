'use strict';

const _ = require('lodash');
const __ = require('hamjest');
const sinon = require('sinon');
const deferMatcher = require('hamjest/test/node/deferMatcher');

const WasCalled = require('./was-called');

describe.only('WasCalled', () => {

	describe('wasCalled', () => {
		let sut;
		beforeEach(() => {
			sut = WasCalled.wasCalled();
		});

		it('should match if a sinon stub was called once', () => {
            const stub = sinon.stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.truthy()));
		});

		it('should match if sinon stub was called more than once', () => {
            const stub = sinon.stub();
            stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.truthy()));
		});

		it('should not match if sinon stub was not called', () => {
            const stub = sinon.stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		it('should not match if actual is a stub function', () => {
            const stub = () => {};

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		it('should not match if actual is not a function', () => {
            const stub = '';

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
            });

			it('should describe the undefined call', () => {

				sut.describeTo(description);

				__.assertThat(description.get(), __.equalTo('a function called a number greater than <0> times'));
			});

            it('should describe mismatch of function type', () => {
				const actual = 'not a function';

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('was not a function'));
            });

            it('should describe mismatch of stub type', () => {
				const actual = () => {};

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('was not a sinon stub to be messured'));
            });

            it('should describe mismatch of call count', () => {
				const actual = sinon.stub();

				sut.describeMismatch(actual, description);

				__.assertThat(description.get(), __.equalTo('function called was <0> times'));
            });
		});
    });
    
    describe('wasCalled with call count', () => {
		let sut;
		beforeEach(() => {
			sut = WasCalled.wasCalled(2);
		});

		it('should match if a sinon stub was called exactly with the call count', () => {
            const stub = sinon.stub();
            stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.truthy()));
		});

		it('should not match if sinon stub was called less times', () => {
            const stub = sinon.stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		it('should not match if sinon stub was called more times', () => {
            const stub = sinon.stub();
            stub();
            stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
            });

            [
                0, 1, 2, 3
            ].forEach((count) => {
                it(`should describe the defined call count of ${count}`, () => {
                    let sut = WasCalled.wasCalled(count);
    
                    sut.describeTo(description);
    
                    __.assertThat(description.get(), __.equalTo(`a function called <${count}> times`));
                });
            });

            [
                0, 1, 2, 3
            ].forEach((count) => {
                it(`should describe mismatch of the defined call count of ${count}`, () => {
                    let sut = WasCalled.wasCalled(count + 1);
                    const actual = sinon.stub();
                    [...new Array(count)].forEach(() => {
                        actual();
                    });

                    sut.describeMismatch(actual, description);

                    __.assertThat(description.get(), __.equalTo(`function called was <${count}> times`));
                });
            });
		});
	});
    
    describe('wasCalled with call count matcher', () => {
		let sut;
		beforeEach(() => {
			sut = WasCalled.wasCalled(__.greaterThan(1));
		});

		it('should match if a sinon stub was called matching the call matcher', () => {
            const stub = sinon.stub();
            stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.truthy()));
		});

		it('should not match if sinon stub was called not matching the call matcher', () => {
            const stub = sinon.stub();
            stub();

            const result = sut.matches(stub);

            __.assertThat(result, __.is(__.falsy()));
		});

		describe('description', () => {
			let description;
			beforeEach(() => {
				description = new __.Description();
            });

            [
                0, 1, 2, 3
            ].forEach((count) => {
                it(`should describe the defined call count of ${count}`, () => {
                    let sut = WasCalled.wasCalled(__.greaterThan(count));
    
                    sut.describeTo(description);
    
                    __.assertThat(description.get(), __.equalTo(`a function called a number greater than <${count}> times`));
                });
            });

            [
                0, 1, 2
            ].forEach((count) => {
                it(`should describe mismatch the defined call count of ${count}`, () => {
                    let sut = WasCalled.wasCalled(__.greaterThan(count));
                    const actual = sinon.stub();
                    [...new Array(count)].forEach(() => {
                        actual();
                    });

                    sut.describeMismatch(actual, description);

                    __.assertThat(description.get(), __.equalTo(`function called was <${count}> times`));
                });
            });
		});

		describe.only('with a promising matcher', () => {
			beforeEach(() => {
				sut = WasCalled.wasCalled(deferMatcher(__.greaterThan(1)));
			});

			it('should return a promise if any of the matchers returns a promise', () => {
				const actual = sinon.stub();

				const result = sut.matches(actual);

				__.assertThat(result, __.hasProperty('then', __.is(__.func())));
			});

			it('should resolve to false if call matcher returns a promise resolving to false', () => {
				const actual = sinon.stub();

				return sut.matches(actual).then((value) => {
					__.assertThat(value, __.is(false));
				});
			});

			it('should resolve to true if call matcher resolve to true', () => {
				const actual = sinon.stub();
				actual();
				actual();

				return sut.matches(actual).then((value) => {
					__.assertThat(value, __.is(true));
				});
			});

			describe('description', () => {
				let description;
				beforeEach(() => {
					description = new __.Description();
				});

				it('should return promise if one of the matchers returns a promise', () => {
					const actual = sinon.stub();

					return sut.describeMismatch(actual, description).then(() => {
						__.assertThat(description.get(), __.equalTo('a string containing "expected": was "another valu"\ndeferred: a string containing "value": deferred: was "another valu"'));
					});
				});
			});
		});
	});
});