import * as __ from 'hamjest';
import * as ___ from 'hamjest-sinon';
import * as sinon from 'sinon';

const mock = sinon.stub();

// wasCalled
__.assertThat(mock, ___.wasCalled(0));
mock();
__.assertThat(mock, ___.wasCalled(1));
__.assertThat(mock, ___.wasCalled(__.greaterThan(0)));

// wasCalledWith
__.assertThat(mock, ___.wasCalledWith());
mock('something');
__.assertThat(mock, ___.wasCalledWith('something'));
__.assertThat(mock, ___.wasCalledWith(__.containsString('ethi')));

// wasCalledInOrder
__.assertThat(mock, ___.wasCalledInOrder([, 'something']));
