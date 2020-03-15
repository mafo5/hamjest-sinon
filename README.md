# Sinon matchers

Sinon matchers are used for testing function calls. Replace the function with a sinon stub or spy and assert the call of the function by your code with these matchers.

## wasCalled(valueOrMatcher)
Assert that a sinon stub was called:
```Javascript
    __.assertThat(stub, __.wasCalled());
```

Assert that a sinon stub was called a specific amount of times:
```Javascript
    __.assertThat(stub, __.wasCalled(2));
```

Assert that a sinon stub was called a variable amount of times:
```Javascript
    __.assertThat(stub, __.wasCalled(__.greaterThan(1)));
```

Assert that a sinon stub was not called:

```Javascript
    __.assertThat(stub, __.wasCalled(0));
    // or
    __.assertThat(stub, __.not(__.wasCalled()));
```

## wasCalledWith(valueOrMatcher)
Assert that a sinon stub was called with empty args:
```Javascript
    __.assertThat(stub, __.wasCalledWith());
    // or 
    __.assertThat(stub, __.wasCalledWith(__.undefined()));
```

Assert that a sinon stub was called with a specific arg:
```Javascript
    __.assertThat(stub, __.wasCalledWith('something'));
```

Assert that a sinon stub was called a variable arg:
```Javascript
    __.assertThat(stub, __.wasCalledWith(__.containsString('something')));
```

Assert that a sinon stub was not called with empty arg:

```Javascript
    __.assertThat(stub, __.not(__.wasCalledWith()));
    // or 
    __.assertThat(stub, __.not(__.wasCalledWith(__.undefined())));
```

## wasCalledInOrder(valueOrMatcher)
Assert that a sinon stub was called in order with specific args:
```Javascript
    __.assertThat(stub, __.wasCalledInOrder('first call with args', 'second call with args'));
```

Assert that a sinon stub was called in order with variable args:
```Javascript
    __.assertThat(stub, __.wasCalledInOrder(__.containsString('first'), __.containsString('second')));
```

Assert that a sinon stub was not called:

```Javascript
    __.assertThat(stub, __.wasCalledInOrder());
    // or 
    __.assertThat(stub, __.wasCalled(0));
```
