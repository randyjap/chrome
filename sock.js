(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":8}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":4}],4:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],7:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],8:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":7,"_process":5,"inherits":6}],9:[function(require,module,exports){
// Empty module for browserify.
exports.unsupported = true;

},{}],10:[function(require,module,exports){
(function (Buffer){
/*!
 * aes.js - aes128/192/256 for bcoin
 * Copyright (c) 2016-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 *
 * Ported from:
 * https://github.com/openssl/openssl/blob/master/crypto/aes/aes_core.c
 * Entered into the public domain by Vincent Rijmen.
 */

/* jshint latedef: false */

'use strict';

var assert = require('assert');
var U32Array = typeof Uint32Array === 'function' ? Uint32Array : Array;

/**
 * @exports crypto/aes
 * @ignore
 */

var AES = exports;

/**
 * An AES key object for encrypting
 * and decrypting blocks.
 * @alias module:crypto/aes.AESKey
 * @constructor
 * @param {Buffer} key
 * @param {Number} bits
 */

function AESKey(key, bits) {
  if (!(this instanceof AESKey))
    return new AESKey(key, bits);

  this.rounds = null;
  this.userKey = key;
  this.bits = bits;

  switch (this.bits) {
    case 128:
      this.rounds = 10;
      break;
    case 192:
      this.rounds = 12;
      break;
    case 256:
      this.rounds = 14;
      break;
    default:
      throw new Error('Bad key size.');
  }

  assert(Buffer.isBuffer(key));
  assert(key.length === this.bits / 8);

  this.decryptKey = null;
  this.encryptKey = null;
}

/**
 * Destroy the object and zero the keys.
 */

AESKey.prototype.destroy = function destroy() {
  var i;

  assert(this.userKey, 'Already destroyed.');

  // User should zero this.
  this.userKey = null;

  if (this.decryptKey) {
    for (i = 0; i < this.decryptKey.length; i++)
      this.decryptKey[i] = 0;
    this.decryptKey = null;
  }

  if (this.encryptKey) {
    for (i = 0; i < this.encryptKey.length; i++)
      this.encryptKey[i] = 0;
    this.encryptKey = null;
  }
};

/**
 * Convert the user key into an encryption key.
 * @returns {Uint32Array} key
 */

AESKey.prototype.getEncryptKey = function getEncryptKey() {
  var i = 0;
  var key, kp, tmp;

  assert(this.userKey, 'Cannot use key once it is destroyed.');

  if (this.encryptKey)
    return this.encryptKey;

  key = new U32Array(60);
  kp = 0;

  key[kp + 0] = readU32(this.userKey, 0);
  key[kp + 1] = readU32(this.userKey, 4);
  key[kp + 2] = readU32(this.userKey, 8);
  key[kp + 3] = readU32(this.userKey, 12);

  this.encryptKey = key;

  if (this.bits === 128) {
    for (;;) {
      tmp = key[kp + 3];

      key[kp + 4] = key[kp + 0]
        ^ (TE2[(tmp >>> 16) & 0xff] & 0xff000000)
        ^ (TE3[(tmp >>> 8) & 0xff] & 0x00ff0000)
        ^ (TE0[(tmp >>> 0) & 0xff] & 0x0000ff00)
        ^ (TE1[(tmp >>> 24) & 0xff] & 0x000000ff)
        ^ RCON[i];
      key[kp + 5] = key[kp + 1] ^ key[kp + 4];
      key[kp + 6] = key[kp + 2] ^ key[kp + 5];
      key[kp + 7] = key[kp + 3] ^ key[kp + 6];

      if (++i === 10)
        return key;

      kp += 4;
    }
  }

  key[kp + 4] = readU32(this.userKey, 16);
  key[kp + 5] = readU32(this.userKey, 20);

  if (this.bits === 192) {
    for (;;) {
      tmp = key[kp + 5];

      key[kp + 6] = key[kp + 0]
        ^ (TE2[(tmp >>> 16) & 0xff] & 0xff000000)
        ^ (TE3[(tmp >>> 8) & 0xff] & 0x00ff0000)
        ^ (TE0[(tmp >>> 0) & 0xff] & 0x0000ff00)
        ^ (TE1[(tmp >>> 24) & 0xff] & 0x000000ff)
        ^ RCON[i];
      key[kp + 7] = key[kp + 1] ^ key[kp + 6];
      key[kp + 8] = key[kp + 2] ^ key[kp + 7];
      key[kp + 9] = key[kp + 3] ^ key[kp + 8];

      if (++i === 8)
        return key;

      key[kp + 10] = key[kp + 4] ^ key[kp + 9];
      key[kp + 11] = key[kp + 5] ^ key[kp + 10];
      kp += 6;
    }
  }

  key[kp + 6] = readU32(this.userKey, 24);
  key[kp + 7] = readU32(this.userKey, 28);

  if (this.bits === 256) {
    for (;;) {
      tmp = key[kp + 7];

      key[kp + 8] = key[kp + 0]
        ^ (TE2[(tmp >>> 16) & 0xff] & 0xff000000)
        ^ (TE3[(tmp >>> 8) & 0xff] & 0x00ff0000)
        ^ (TE0[(tmp >>> 0) & 0xff] & 0x0000ff00)
        ^ (TE1[(tmp >>> 24) & 0xff] & 0x000000ff)
        ^ RCON[i];
      key[kp + 9] = key[kp + 1] ^ key[kp + 8];
      key[kp + 10] = key[kp + 2] ^ key[kp + 9];
      key[kp + 11] = key[kp + 3] ^ key[kp + 10];

      if (++i === 7)
        return key;

      tmp = key[kp + 11];

      key[kp + 12] = key[kp +  4]
        ^ (TE2[(tmp >>> 24) & 0xff] & 0xff000000)
        ^ (TE3[(tmp >>> 16) & 0xff] & 0x00ff0000)
        ^ (TE0[(tmp >>> 8) & 0xff] & 0x0000ff00)
        ^ (TE1[(tmp >>> 0) & 0xff] & 0x000000ff);
      key[kp + 13] = key[kp +  5] ^ key[kp + 12];
      key[kp + 14] = key[kp +  6] ^ key[kp + 13];
      key[kp + 15] = key[kp +  7] ^ key[kp + 14];

      kp += 8;
    }
  }

  return key;
};

/**
 * Convert the user key into a decryption key.
 * @returns {Uint32Array} key
 */

AESKey.prototype.getDecryptKey = function getDecryptKey() {
  var i, j, kp, enc, key, tmp;

  assert(this.userKey, 'Cannot use key once it is destroyed.');

  if (this.decryptKey)
    return this.decryptKey;

  // First, start with an encryption schedule.
  enc = this.getEncryptKey();
  key = new U32Array(60);
  kp = 0;

  for (i = 0; i < enc.length; i++)
    key[i] = enc[i];

  this.decryptKey = key;

  // Invert the order of the round keys.
  for (i = 0, j = 4 * this.rounds; i < j; i += 4, j -= 4) {
    tmp = key[kp + i + 0];
    key[kp + i + 0] = key[kp + j + 0];
    key[kp + j + 0] = tmp;

    tmp = key[kp + i + 1];
    key[kp + i + 1] = key[kp + j + 1];
    key[kp + j + 1] = tmp;

    tmp = key[kp + i + 2];
    key[kp + i + 2] = key[kp + j + 2];
    key[kp + j + 2] = tmp;

    tmp = key[kp + i + 3];
    key[kp + i + 3] = key[kp + j + 3];
    key[kp + j + 3] = tmp;
  }

  // Apply the inverse MixColumn transform to
  // all round keys but the first and the last.
  for (i = 1; i < this.rounds; i++) {
    kp += 4;
    key[kp + 0] = TD0[TE1[(key[kp + 0] >>> 24) & 0xff] & 0xff]
      ^ TD1[TE1[(key[kp + 0] >>> 16) & 0xff] & 0xff]
      ^ TD2[TE1[(key[kp + 0] >>> 8) & 0xff] & 0xff]
      ^ TD3[TE1[(key[kp + 0] >>> 0) & 0xff] & 0xff];
    key[kp + 1] = TD0[TE1[(key[kp + 1] >>> 24) & 0xff] & 0xff]
      ^ TD1[TE1[(key[kp + 1] >>> 16) & 0xff] & 0xff]
      ^ TD2[TE1[(key[kp + 1] >>> 8) & 0xff] & 0xff]
      ^ TD3[TE1[(key[kp + 1] >>> 0) & 0xff] & 0xff];
    key[kp + 2] = TD0[TE1[(key[kp + 2] >>> 24) & 0xff] & 0xff]
      ^ TD1[TE1[(key[kp + 2] >>> 16) & 0xff] & 0xff]
      ^ TD2[TE1[(key[kp + 2] >>> 8) & 0xff] & 0xff]
      ^ TD3[TE1[(key[kp + 2] >>> 0) & 0xff] & 0xff];
    key[kp + 3] = TD0[TE1[(key[kp + 3] >>> 24) & 0xff] & 0xff]
      ^ TD1[TE1[(key[kp + 3] >>> 16) & 0xff] & 0xff]
      ^ TD2[TE1[(key[kp + 3] >>> 8) & 0xff] & 0xff]
      ^ TD3[TE1[(key[kp + 3] >>> 0) & 0xff] & 0xff];
  }

  return key;
};

/**
 * Encrypt a 16 byte block of data.
 * @param {Buffer} input
 * @returns {Buffer}
 */

AESKey.prototype.encryptBlock = function encryptBlock(input) {
  var output, kp, key, r, s0, s1, s2, s3, t0, t1, t2, t3;

  assert(this.userKey, 'Cannot use key once it is destroyed.');

  key = this.getEncryptKey();
  kp = 0;

  // Map byte array block to cipher
  // state and add initial round key.
  s0 = readU32(input, 0) ^ key[0];
  s1 = readU32(input, 4) ^ key[1];
  s2 = readU32(input, 8) ^ key[2];
  s3 = readU32(input, 12) ^ key[3];

  // Nr - 1 full rounds
  r = this.rounds >>> 1;

  for (;;) {
    t0 = TE0[(s0 >>> 24) & 0xff]
      ^ TE1[(s1 >>> 16) & 0xff]
      ^ TE2[(s2 >>> 8) & 0xff]
      ^ TE3[(s3 >>> 0) & 0xff]
      ^ key[kp + 4];
    t1 = TE0[(s1 >>> 24) & 0xff]
      ^ TE1[(s2 >>> 16) & 0xff]
      ^ TE2[(s3 >>> 8) & 0xff]
      ^ TE3[(s0 >>> 0) & 0xff]
      ^ key[kp + 5];
    t2 = TE0[(s2 >>> 24) & 0xff]
      ^ TE1[(s3 >>> 16) & 0xff]
      ^ TE2[(s0 >>> 8) & 0xff]
      ^ TE3[(s1 >>> 0) & 0xff]
      ^ key[kp + 6];
    t3 = TE0[(s3 >>> 24) & 0xff]
      ^ TE1[(s0 >>> 16) & 0xff]
      ^ TE2[(s1 >>> 8) & 0xff]
      ^ TE3[(s2 >>> 0) & 0xff]
      ^ key[kp + 7];

    kp += 8;

    if (--r === 0)
      break;

    s0 = TE0[(t0 >>> 24) & 0xff]
      ^ TE1[(t1 >>> 16) & 0xff]
      ^ TE2[(t2 >>> 8) & 0xff]
      ^ TE3[(t3 >>> 0) & 0xff]
      ^ key[kp + 0];
    s1 = TE0[(t1 >>> 24) & 0xff]
      ^ TE1[(t2 >>> 16) & 0xff]
      ^ TE2[(t3 >>> 8) & 0xff]
      ^ TE3[(t0 >>> 0) & 0xff]
      ^ key[kp + 1];
    s2 = TE0[(t2 >>> 24) & 0xff]
      ^ TE1[(t3 >>> 16) & 0xff]
      ^ TE2[(t0 >>> 8) & 0xff]
      ^ TE3[(t1 >>> 0) & 0xff]
      ^ key[kp + 2];
    s3 = TE0[(t3 >>> 24) & 0xff]
      ^ TE1[(t0 >>> 16) & 0xff]
      ^ TE2[(t1 >>> 8) & 0xff]
      ^ TE3[(t2 >>> 0) & 0xff]
      ^ key[kp + 3];
  }

  // Apply last round and map cipher
  // state to byte array block.
  s0 = (TE2[(t0 >>> 24) & 0xff] & 0xff000000)
    ^ (TE3[(t1 >>> 16) & 0xff] & 0x00ff0000)
    ^ (TE0[(t2 >>> 8) & 0xff] & 0x0000ff00)
    ^ (TE1[(t3 >>> 0) & 0xff] & 0x000000ff)
    ^ key[kp + 0];
  s1 = (TE2[(t1 >>> 24) & 0xff] & 0xff000000)
    ^ (TE3[(t2 >>> 16) & 0xff] & 0x00ff0000)
    ^ (TE0[(t3 >>> 8) & 0xff] & 0x0000ff00)
    ^ (TE1[(t0 >>> 0) & 0xff] & 0x000000ff)
    ^ key[kp + 1];
  s2 = (TE2[(t2 >>> 24) & 0xff] & 0xff000000)
    ^ (TE3[(t3 >>> 16) & 0xff] & 0x00ff0000)
    ^ (TE0[(t0 >>> 8) & 0xff] & 0x0000ff00)
    ^ (TE1[(t1 >>> 0) & 0xff] & 0x000000ff)
    ^ key[kp + 2];
  s3 = (TE2[(t3 >>> 24) & 0xff] & 0xff000000)
    ^ (TE3[(t0 >>> 16) & 0xff] & 0x00ff0000)
    ^ (TE0[(t1 >>> 8) & 0xff] & 0x0000ff00)
    ^ (TE1[(t2 >>> 0) & 0xff] & 0x000000ff)
    ^ key[kp + 3];

  output = new Buffer(16);
  writeU32(output, s0, 0);
  writeU32(output, s1, 4);
  writeU32(output, s2, 8);
  writeU32(output, s3, 12);

  return output;
};

/**
 * Decrypt a 16 byte block of data.
 * @param {Buffer} input
 * @returns {Buffer}
 */

AESKey.prototype.decryptBlock = function decryptBlock(input) {
  var output, kp, key, r, s0, s1, s2, s3, t0, t1, t2, t3;

  assert(this.userKey, 'Cannot use AESKey once it is destroyed.');

  key = this.getDecryptKey();
  kp = 0;

  // Map byte array block to cipher
  // state and add initial round key.
  s0 = readU32(input, 0) ^ key[kp + 0];
  s1 = readU32(input, 4) ^ key[kp + 1];
  s2 = readU32(input, 8) ^ key[kp + 2];
  s3 = readU32(input, 12) ^ key[kp + 3];

  // Nr - 1 full rounds
  r = this.rounds >>> 1;

  for (;;) {
    t0 = TD0[(s0 >>> 24) & 0xff]
      ^ TD1[(s3 >>> 16) & 0xff]
      ^ TD2[(s2 >>> 8) & 0xff]
      ^ TD3[(s1 >>> 0) & 0xff]
      ^ key[kp + 4];
    t1 = TD0[(s1 >>> 24) & 0xff]
      ^ TD1[(s0 >>> 16) & 0xff]
      ^ TD2[(s3 >>> 8) & 0xff]
      ^ TD3[(s2 >>> 0) & 0xff]
      ^ key[kp + 5];
    t2 = TD0[(s2 >>> 24) & 0xff]
      ^ TD1[(s1 >>> 16) & 0xff]
      ^ TD2[(s0 >>> 8) & 0xff]
      ^ TD3[(s3 >>> 0) & 0xff]
      ^ key[kp + 6];
    t3 = TD0[(s3 >>> 24) & 0xff]
      ^ TD1[(s2 >>> 16) & 0xff]
      ^ TD2[(s1 >>> 8) & 0xff]
      ^ TD3[(s0 >>> 0) & 0xff]
      ^ key[kp + 7];

    kp += 8;

    if (--r === 0)
        break;

    s0 = TD0[(t0 >>> 24) & 0xff]
      ^ TD1[(t3 >>> 16) & 0xff]
      ^ TD2[(t2 >>> 8) & 0xff]
      ^ TD3[(t1 >>> 0) & 0xff]
      ^ key[kp + 0];
    s1 = TD0[(t1 >>> 24) & 0xff]
      ^ TD1[(t0 >>> 16) & 0xff]
      ^ TD2[(t3 >>> 8) & 0xff]
      ^ TD3[(t2 >>> 0) & 0xff]
      ^ key[kp + 1];
    s2 = TD0[(t2 >>> 24) & 0xff]
      ^ TD1[(t1 >>> 16) & 0xff]
      ^ TD2[(t0 >>> 8) & 0xff]
      ^ TD3[(t3 >>> 0) & 0xff]
      ^ key[kp + 2];
    s3 = TD0[(t3 >>> 24) & 0xff]
      ^ TD1[(t2 >>> 16) & 0xff]
      ^ TD2[(t1 >>> 8) & 0xff]
      ^ TD3[(t0 >>> 0) & 0xff]
      ^ key[kp + 3];
  }

  // Apply last round and map cipher
  // state to byte array block.
  s0 = (TD4[(t0 >>> 24) & 0xff] << 24)
    ^ (TD4[(t3 >>> 16) & 0xff] << 16)
    ^ (TD4[(t2 >>> 8) & 0xff] << 8)
    ^ (TD4[(t1 >>> 0) & 0xff] << 0)
    ^ key[kp + 0];
  s1 = (TD4[(t1 >>> 24) & 0xff] << 24)
    ^ (TD4[(t0 >>> 16) & 0xff] << 16)
    ^ (TD4[(t3 >>> 8) & 0xff] << 8)
    ^ (TD4[(t2 >>> 0) & 0xff] << 0)
    ^ key[kp + 1];
  s2 = (TD4[(t2 >>> 24) & 0xff] << 24)
    ^ (TD4[(t1 >>> 16) & 0xff] << 16)
    ^ (TD4[(t0 >>> 8) & 0xff] << 8)
    ^ (TD4[(t3 >>> 0) & 0xff] << 0)
    ^ key[kp + 2];
  s3 = (TD4[(t3 >>> 24) & 0xff] << 24)
    ^ (TD4[(t2 >>> 16) & 0xff] << 16)
    ^ (TD4[(t1 >>> 8) & 0xff] << 8)
    ^ (TD4[(t0 >>> 0) & 0xff] << 0)
    ^ key[kp + 3];

  output = new Buffer(16);
  writeU32(output, s0, 0);
  writeU32(output, s1, 4);
  writeU32(output, s2, 8);
  writeU32(output, s3, 12);

  return output;
};

/**
 * AES cipher.
 * @alias module:crypto/aes.AESCipher
 * @constructor
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {Number} bits
 * @param {String} mode
 */

function AESCipher(key, iv, bits, mode) {
  if (!(this instanceof AESCipher))
    return new AESCipher(key, iv, mode);

  assert(mode === 'ecb' || mode === 'cbc', 'Unknown mode.');

  this.key = new AESKey(key, bits);
  this.mode = mode;
  this.prev = iv;
  this.waiting = null;
}

/**
 * Encrypt blocks of data.
 * @param {Buffer} data
 * @returns {Buffer}
 */

AESCipher.prototype.update = function update(data) {
  var blocks = [];
  var i, len, trailing, block;

  if (this.waiting) {
    data = concat(this.waiting, data);
    this.waiting = null;
  }

  trailing = data.length % 16;
  len = data.length - trailing;

  // Encrypt all blocks except for the last.
  for (i = 0; i < len; i += 16) {
    block = data.slice(i, i + 16);
    if (this.mode === 'cbc')
      block = xor(block, this.prev);
    this.prev = this.key.encryptBlock(block);
    blocks.push(this.prev);
  }

  if (trailing > 0)
    this.waiting = data.slice(len);

  return Buffer.concat(blocks);
};

/**
 * Finalize the cipher.
 * @returns {Buffer}
 */

AESCipher.prototype.final = function final() {
  var block, left, pad;

  // Handle padding on the last block.
  if (!this.waiting) {
    block = new Buffer(16);
    block.fill(16);
  } else {
    block = this.waiting;
    left = 16 - block.length;
    pad = new Buffer(left);
    pad.fill(left);
    block = concat(block, pad);
  }

  // Encrypt the last block,
  // as well as the padding.
  if (this.mode === 'cbc')
    block = xor(block, this.prev);

  block = this.key.encryptBlock(block);

  this.key.destroy();

  return block;
};

/**
 * AES decipher.
 * @alias module:crypto/aes.AESDecipher
 * @constructor
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {Number} bits
 * @param {String} mode
 */

function AESDecipher(key, iv, bits, mode) {
  if (!(this instanceof AESDecipher))
    return new AESDecipher(key, iv, mode);

  assert(mode === 'ecb' || mode === 'cbc', 'Unknown mode.');

  this.key = new AESKey(key, bits);
  this.mode = mode;
  this.prev = iv;
  this.waiting = null;
  this.lastBlock = null;
}

/**
 * Decrypt blocks of data.
 * @param {Buffer} data
 */

AESDecipher.prototype.update = function update(data) {
  var blocks = [];
  var i, chunk, block, len, trailing;

  if (this.waiting) {
    data = concat(this.waiting, data);
    this.waiting = null;
  }

  trailing = data.length % 16;
  len = data.length - trailing;

  // Decrypt all blocks.
  for (i = 0; i < len; i += 16) {
    chunk = this.prev;
    this.prev = data.slice(i, i + 16);
    block = this.key.decryptBlock(this.prev);
    if (this.mode === 'cbc')
      block = xor(block, chunk);
    blocks.push(block);
  }

  if (trailing > 0)
    this.waiting = data.slice(len);

  if (this.lastBlock) {
    blocks.unshift(this.lastBlock);
    this.lastBlock = null;
  }

  // Keep a reference to the last
  // block for the padding check.
  this.lastBlock = blocks.pop();

  return Buffer.concat(blocks);
};

/**
 * Finalize the decipher.
 * @returns {Buffer}
 */

AESDecipher.prototype.final = function final() {
  var i, b, n, block;

  this.key.destroy();

  assert(!this.waiting, 'Bad decrypt (trailing bytes).');
  assert(this.lastBlock, 'Bad decrypt (no data).');

  // Check padding on the last block.
  block = this.lastBlock;
  b = 16;
  n = block[b - 1];

  if (n === 0 || n > b)
    throw new Error('Bad decrypt (padding).');

  for (i = 0; i < n; i++) {
    if (block[--b] !== n)
      throw new Error('Bad decrypt (padding).');
  }

  // Slice off the padding unless
  // the entire block was padding.
  if (n === 16)
    return new Buffer(0);

  block = block.slice(0, -n);

  return block;
};

/**
 * Encrypt data with aes 256.
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @param {String} mode
 * @returns {Buffer}
 */

AES.encrypt = function encrypt(data, key, iv, bits, mode) {
  var cipher = new AESCipher(key, iv, bits, mode);
  return concat(cipher.update(data), cipher.final());
};

/**
 * Decrypt data with aes 256.
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer|null} iv
 * @param {Number} bits
 * @param {String} mode
 * @returns {Buffer}
 */

AES.decrypt = function decrypt(data, key, iv, bits, mode) {
  var decipher = new AESDecipher(key, iv, bits, mode);
  return concat(decipher.update(data), decipher.final());
};

/**
 * Electronic codebook mode.
 */

AES.ecb = {};

/**
 * Encrypt data with aes 256 ecb.
 * @param {Buffer} data
 * @param {Buffer} key
 * @returns {Buffer}
 */

AES.ecb.encrypt = function encrypt(data, key) {
  assert(Buffer.isBuffer(data));
  assert(key.length === 32);
  return AES.encrypt(data, key, null, 256, 'ecb');
};

/**
 * Decrypt data with aes 256 ecb.
 * @param {Buffer} data
 * @param {Buffer} key
 * @returns {Buffer}
 */

AES.ecb.decrypt = function decrypt(data, key) {
  assert(Buffer.isBuffer(data));
  assert(key.length === 32);
  return AES.decrypt(data, key, null, 256, 'ecb');
};

/**
 * Cipher block chaining mode.
 */

AES.cbc = {};

/**
 * Encrypt data with aes 256 cbc.
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @returns {Buffer}
 */

AES.cbc.encrypt = function encrypt(data, key, iv) {
  assert(Buffer.isBuffer(data));
  assert(key.length === 32);
  assert(iv.length === 16);
  return AES.encrypt(data, key, iv, 256, 'cbc');
};

/**
 * Decrypt data with aes 256 cbc.
 * @param {Buffer} data
 * @param {Buffer} key
 * @param {Buffer} iv
 * @returns {Buffer}
 */

AES.cbc.decrypt = function decrypt(data, key, iv) {
  assert(Buffer.isBuffer(data));
  assert(key.length === 32);
  assert(iv.length === 16);
  return AES.decrypt(data, key, iv, 256, 'cbc');
};

/*
 * Expose
 */

AES.Key = AESKey;
AES.Cipher = AESCipher;
AES.Decipher = AESDecipher;
AES.encipher = AES.cbc.encrypt;
AES.decipher = AES.cbc.decrypt;

/*
 * Helpers
 */

function xor(v1, v2) {
  var out = new Buffer(v1.length);
  for (var i = 0; i < v1.length; i++)
    out[i] = v1[i] ^ v2[i];
  return out;
}

function readU32(data, i) {
  return (data[i + 0] << 24)
    ^ (data[i + 1] << 16)
    ^ (data[i + 2] << 8)
    ^ data[i + 3];
}

function writeU32(data, value, i) {
  data[i + 0] = (value >>> 24) & 0xff;
  data[i + 1] = (value >>> 16) & 0xff;
  data[i + 2] = (value >>> 8) & 0xff;
  data[i + 3] = value & 0xff;
}

function concat(a, b) {
  var data = new Buffer(a.length + b.length);
  a.copy(data, 0);
  b.copy(data, a.length);
  return data;
}

/*
 * Tables
 */

var TE0 = [
  0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d,
  0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554,
  0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d,
  0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a,
  0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87,
  0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b,
  0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea,
  0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b,
  0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a,
  0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f,
  0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108,
  0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f,
  0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e,
  0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5,
  0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d,
  0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f,
  0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e,
  0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb,
  0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce,
  0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497,
  0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c,
  0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed,
  0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b,
  0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a,
  0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16,
  0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594,
  0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81,
  0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3,
  0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a,
  0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504,
  0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163,
  0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d,
  0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f,
  0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739,
  0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47,
  0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395,
  0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f,
  0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883,
  0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c,
  0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76,
  0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e,
  0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4,
  0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6,
  0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b,
  0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7,
  0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0,
  0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25,
  0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818,
  0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72,
  0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651,
  0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21,
  0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85,
  0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa,
  0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12,
  0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0,
  0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9,
  0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133,
  0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7,
  0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920,
  0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a,
  0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17,
  0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8,
  0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11,
  0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a
];

var TE1 = [
  0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b,
  0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5,
  0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b,
  0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676,
  0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d,
  0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0,
  0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf,
  0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0,
  0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626,
  0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc,
  0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1,
  0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515,
  0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3,
  0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a,
  0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2,
  0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575,
  0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a,
  0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0,
  0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3,
  0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484,
  0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded,
  0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b,
  0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939,
  0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf,
  0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb,
  0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585,
  0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f,
  0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8,
  0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f,
  0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5,
  0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121,
  0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2,
  0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec,
  0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717,
  0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d,
  0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373,
  0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc,
  0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888,
  0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414,
  0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb,
  0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a,
  0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c,
  0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262,
  0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979,
  0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d,
  0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9,
  0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea,
  0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808,
  0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e,
  0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6,
  0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f,
  0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a,
  0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666,
  0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e,
  0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9,
  0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e,
  0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111,
  0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494,
  0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9,
  0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf,
  0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d,
  0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868,
  0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f,
  0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616
];

var TE2 = [
  0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b,
  0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5,
  0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b,
  0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76,
  0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d,
  0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0,
  0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af,
  0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0,
  0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26,
  0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc,
  0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1,
  0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15,
  0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3,
  0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a,
  0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2,
  0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75,
  0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a,
  0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0,
  0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3,
  0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384,
  0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed,
  0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b,
  0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239,
  0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf,
  0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb,
  0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185,
  0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f,
  0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8,
  0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f,
  0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5,
  0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221,
  0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2,
  0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec,
  0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17,
  0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d,
  0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673,
  0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc,
  0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88,
  0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814,
  0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb,
  0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a,
  0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c,
  0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462,
  0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279,
  0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d,
  0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9,
  0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea,
  0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008,
  0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e,
  0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6,
  0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f,
  0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a,
  0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66,
  0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e,
  0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9,
  0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e,
  0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211,
  0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394,
  0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9,
  0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df,
  0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d,
  0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068,
  0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f,
  0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16
];

var TE3 = [
  0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6,
  0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491,
  0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56,
  0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec,
  0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa,
  0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb,
  0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45,
  0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b,
  0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c,
  0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83,
  0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9,
  0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a,
  0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d,
  0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f,
  0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf,
  0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea,
  0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34,
  0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b,
  0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d,
  0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713,
  0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1,
  0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6,
  0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72,
  0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85,
  0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed,
  0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411,
  0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe,
  0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b,
  0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05,
  0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1,
  0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342,
  0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf,
  0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3,
  0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e,
  0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a,
  0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6,
  0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3,
  0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b,
  0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28,
  0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad,
  0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14,
  0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8,
  0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4,
  0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2,
  0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da,
  0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049,
  0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf,
  0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810,
  0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c,
  0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197,
  0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e,
  0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f,
  0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc,
  0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c,
  0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069,
  0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927,
  0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322,
  0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733,
  0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9,
  0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5,
  0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a,
  0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0,
  0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e,
  0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c
];

var TD0 = [
  0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96,
  0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393,
  0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25,
  0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f,
  0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1,
  0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6,
  0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da,
  0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844,
  0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd,
  0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4,
  0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45,
  0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94,
  0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7,
  0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a,
  0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5,
  0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c,
  0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1,
  0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a,
  0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75,
  0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051,
  0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46,
  0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff,
  0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77,
  0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb,
  0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000,
  0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e,
  0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927,
  0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a,
  0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e,
  0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16,
  0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d,
  0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8,
  0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd,
  0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34,
  0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163,
  0xd731dcca, 0x42638510, 0x13972240, 0x84c61120,
  0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d,
  0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0,
  0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422,
  0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef,
  0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36,
  0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4,
  0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662,
  0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5,
  0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3,
  0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b,
  0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8,
  0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6,
  0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6,
  0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0,
  0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815,
  0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f,
  0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df,
  0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f,
  0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e,
  0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713,
  0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89,
  0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c,
  0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf,
  0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86,
  0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f,
  0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541,
  0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190,
  0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742
];

var TD1 = [
  0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e,
  0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303,
  0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c,
  0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3,
  0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0,
  0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9,
  0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259,
  0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8,
  0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971,
  0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a,
  0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f,
  0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b,
  0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8,
  0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab,
  0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708,
  0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682,
  0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2,
  0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe,
  0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb,
  0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10,
  0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd,
  0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015,
  0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e,
  0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee,
  0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000,
  0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72,
  0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39,
  0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e,
  0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91,
  0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a,
  0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17,
  0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9,
  0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60,
  0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e,
  0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1,
  0xcad731dc, 0x10426385, 0x40139722, 0x2084c611,
  0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1,
  0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3,
  0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964,
  0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390,
  0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b,
  0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf,
  0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46,
  0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af,
  0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512,
  0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb,
  0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a,
  0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8,
  0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c,
  0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266,
  0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8,
  0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6,
  0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604,
  0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551,
  0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41,
  0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647,
  0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c,
  0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1,
  0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737,
  0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db,
  0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340,
  0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95,
  0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1,
  0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857
];

var TD2 = [
  0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27,
  0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3,
  0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502,
  0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562,
  0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe,
  0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3,
  0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552,
  0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9,
  0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9,
  0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce,
  0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253,
  0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908,
  0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b,
  0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655,
  0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337,
  0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16,
  0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69,
  0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6,
  0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6,
  0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e,
  0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6,
  0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050,
  0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9,
  0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8,
  0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000,
  0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a,
  0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d,
  0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436,
  0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b,
  0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12,
  0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b,
  0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e,
  0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f,
  0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb,
  0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4,
  0xdccad731, 0x85104263, 0x22401397, 0x112084c6,
  0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729,
  0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1,
  0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9,
  0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233,
  0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4,
  0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad,
  0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e,
  0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3,
  0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25,
  0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b,
  0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f,
  0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15,
  0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0,
  0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2,
  0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7,
  0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791,
  0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496,
  0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665,
  0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b,
  0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6,
  0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13,
  0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47,
  0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7,
  0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844,
  0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3,
  0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d,
  0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456,
  0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8
];

var TD3 = [
  0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a,
  0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b,
  0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5,
  0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5,
  0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d,
  0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b,
  0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95,
  0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e,
  0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27,
  0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d,
  0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562,
  0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9,
  0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752,
  0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66,
  0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3,
  0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced,
  0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e,
  0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4,
  0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4,
  0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd,
  0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d,
  0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60,
  0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767,
  0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79,
  0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000,
  0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c,
  0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736,
  0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24,
  0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b,
  0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c,
  0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12,
  0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814,
  0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3,
  0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b,
  0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8,
  0x31dccad7, 0x63851042, 0x97224013, 0xc6112084,
  0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7,
  0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077,
  0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247,
  0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22,
  0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698,
  0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f,
  0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254,
  0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582,
  0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf,
  0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb,
  0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883,
  0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef,
  0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629,
  0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035,
  0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533,
  0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17,
  0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4,
  0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46,
  0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb,
  0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d,
  0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb,
  0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a,
  0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73,
  0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678,
  0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2,
  0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff,
  0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064,
  0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0
];

var TD4 = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38,
  0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
  0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d,
  0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2,
  0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16,
  0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda,
  0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a,
  0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02,
  0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea,
  0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85,
  0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89,
  0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20,
  0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31,
  0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d,
  0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0,
  0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26,
  0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

var RCON = [
  0x01000000, 0x02000000, 0x04000000, 0x08000000,
  0x10000000, 0x20000000, 0x40000000, 0x80000000,
  0x1B000000, 0x36000000
];

}).call(this,require("buffer").Buffer)
},{"assert":1,"buffer":3}],11:[function(require,module,exports){
(function (Buffer){
/*!
 * backend-browser.js - browser crypto backend for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var assert = require('assert');
var hashjs = require('hash.js');
var util = require('../utils/util');
var aes = require('./aes');
var sha256 = require('./sha256');
var global = util.global;
var crypto = global.crypto || global.msCrypto || {};
var subtle = crypto.subtle && crypto.subtle.importKey ? crypto.subtle : {};
var backend = exports;

/*
 * Hashing
 */

backend.hash = function hash(alg, data) {
  var hash;

  if (alg === 'sha256')
    return sha256.digest(data);

  hash = hashjs[alg];

  assert(hash != null, 'Unknown algorithm.');

  return new Buffer(hash().update(data).digest());
};

backend.ripemd160 = function ripemd160(data) {
  return backend.hash('ripemd160', data);
};

backend.sha1 = function sha1(data) {
  return backend.hash('sha1', data);
};

backend.sha256 = function _sha256(data) {
  return sha256.digest(data);
};

backend.hash160 = function hash160(data) {
  return backend.hash('ripemd160', sha256.digest(data));
};

backend.hash256 = function hash256(data) {
  return sha256.hash256(data);
};

backend.hmac = function _hmac(alg, data, key) {
  var hash = hashjs[alg];
  var hmac;

  assert(hash != null, 'Unknown algorithm.');

  hmac = hashjs.hmac(hash, key);

  return new Buffer(hmac.update(data).digest());
};

/*
 * Key Derivation
 */

backend.pbkdf2 = function pbkdf2(key, salt, iter, len, alg) {
  var size = backend.hash(alg, new Buffer(0)).length;
  var blocks = Math.ceil(len / size);
  var out = new Buffer(len);
  var buf = new Buffer(salt.length + 4);
  var block = new Buffer(size);
  var pos = 0;
  var i, j, k, mac;

  salt.copy(buf, 0);

  for (i = 0; i < blocks; i++) {
    buf.writeUInt32BE(i + 1, salt.length, true);
    mac = backend.hmac(alg, buf, key);
    mac.copy(block, 0);
    for (j = 1; j < iter; j++) {
      mac = backend.hmac(alg, mac, key);
      for (k = 0; k < size; k++)
        block[k] ^= mac[k];
    }
    block.copy(out, pos);
    pos += size;
  }

  return out;
};

backend.pbkdf2Async = function pbkdf2Async(key, salt, iter, len, alg) {
  var algo = { name: 'PBKDF2' };
  var use = ['deriveBits'];
  var name = backend.getHash(alg);
  var length = len * 8;
  var options, promise;

  options = {
    name: 'PBKDF2',
    salt: salt,
    iterations: iter,
    hash: name
  };

  promise = subtle.importKey('raw', key, algo, false, use);

  return promise.then(function(key) {
    return subtle.deriveBits(options, key, length);
  }).then(function(result) {
    return new Buffer(result);
  });
};

if (!subtle.deriveBits)
  backend.pbkdf2Async = util.promisify(backend.pbkdf2);

/*
 * Ciphers
 */

backend.encipher = function encipher(data, key, iv) {
  return aes.cbc.encrypt(data, key, iv);
};

backend.decipher = function decipher(data, key, iv) {
  try {
    return aes.cbc.decrypt(data, key, iv);
  } catch (e) {
    throw new Error('Bad key for decryption.');
  }
};

/*
 * Misc
 */

backend.randomBytes = function randomBytes(n) {
  var data = new Uint8Array(n);
  crypto.getRandomValues(data);
  return new Buffer(data.buffer);
};

if (!crypto.getRandomValues) {
  // Out of luck here. Use bad randomness for now.
  backend.randomBytes = function randomBytes(n) {
    var data = new Buffer(n);
    var i;

    for (i = 0; i < data.length; i++)
      data[i] = Math.floor(Math.random() * 256);

    return data;
  };
}

backend.getHash = function getHash(name) {
  switch (name) {
    case 'sha1':
      return 'SHA-1';
    case 'sha256':
      return 'SHA-256';
    case 'sha384':
      return 'SHA-384';
    case 'sha512':
      return 'SHA-512';
    default:
      throw new Error('Algorithm not supported: ' + name);
  }
};

backend.crypto = crypto;
backend.subtle = subtle;

}).call(this,require("buffer").Buffer)
},{"../utils/util":18,"./aes":10,"./sha256":14,"assert":1,"buffer":3,"hash.js":19}],12:[function(require,module,exports){
(function (Buffer){
/*!
 * crypto.js - crypto for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var backend = require('./backend');
var native = require('../utils/native').binding;
var scrypt = require('./scrypt');

/**
 * @exports crypto/crypto
 * @ignore
 */

var crypto = exports;

/**
 * Hash with chosen algorithm.
 * @function
 * @param {String} alg
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.hash = backend.hash;

/**
 * Hash with ripemd160.
 * @function
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.ripemd160 = backend.ripemd160;

/**
 * Hash with sha1.
 * @function
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.sha1 = backend.sha1;

/**
 * Hash with sha256.
 * @function
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.sha256 = backend.sha256;

/**
 * Hash with sha256 and ripemd160 (OP_HASH160).
 * @function
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.hash160 = backend.hash160;

/**
 * Hash with sha256 twice (OP_HASH256).
 * @function
 * @param {Buffer} data
 * @returns {Buffer}
 */

crypto.hash256 = backend.hash256;

/**
 * Create an HMAC.
 * @function
 * @param {String} alg
 * @param {Buffer} data
 * @param {Buffer} key
 * @returns {Buffer} HMAC
 */

crypto.hmac = backend.hmac;

/**
 * Perform key derivation using PBKDF2.
 * @function
 * @param {Buffer} key
 * @param {Buffer} salt
 * @param {Number} iter
 * @param {Number} len
 * @param {String} alg
 * @returns {Buffer}
 */

crypto.pbkdf2 = backend.pbkdf2;

/**
 * Execute pbkdf2 asynchronously.
 * @function
 * @param {Buffer} key
 * @param {Buffer} salt
 * @param {Number} iter
 * @param {Number} len
 * @param {String} alg
 * @returns {Promise}
 */

crypto.pbkdf2Async = backend.pbkdf2Async;

/**
 * Perform key derivation using scrypt.
 * @function
 * @param {Buffer} passwd
 * @param {Buffer} salt
 * @param {Number} N
 * @param {Number} r
 * @param {Number} p
 * @param {Number} len
 * @returns {Buffer}
 */

crypto.scrypt = scrypt.scrypt;

/**
 * Execute scrypt asynchronously.
 * @function
 * @param {Buffer} passwd
 * @param {Buffer} salt
 * @param {Number} N
 * @param {Number} r
 * @param {Number} p
 * @param {Number} len
 * @returns {Promise}
 */

crypto.scryptAsync = scrypt.scryptAsync;

/**
 * Perform hkdf extraction.
 * @param {Buffer} ikm
 * @param {Buffer} key
 * @param {String} alg
 * @returns {Buffer}
 */

crypto.hkdfExtract = function hkdfExtract(ikm, key, alg) {
  return crypto.hmac(alg, ikm, key);
};

/**
 * Perform hkdf expansion.
 * @param {Buffer} prk
 * @param {Buffer} info
 * @param {Number} len
 * @param {String} alg
 * @returns {Buffer}
 */

crypto.hkdfExpand = function hkdfExpand(prk, info, len, alg) {
  var size = crypto.hash(alg, new Buffer(0)).length;
  var blocks = Math.ceil(len / size);
  var i, okm, buf, out;

  if (blocks > 255)
    throw new Error('Too many blocks.');

  okm = new Buffer(len);

  if (blocks === 0)
    return okm;

  buf = new Buffer(size + info.length + 1);

  // First round:
  info.copy(buf, size);
  buf[buf.length - 1] = 1;
  out = crypto.hmac(alg, buf.slice(size), prk);
  out.copy(okm, 0);

  for (i = 1; i < blocks; i++) {
    out.copy(buf, 0);
    buf[buf.length - 1]++;
    out = crypto.hmac(alg, buf, prk);
    out.copy(okm, i * size);
  }

  return okm;
};

/**
 * Build a merkle tree from leaves.
 * Note that this will mutate the `leaves` array!
 * @param {Buffer[]} leaves
 * @returns {MerkleTree}
 */

crypto.createMerkleTree = function createMerkleTree(leaves) {
  var nodes = leaves;
  var size = leaves.length;
  var malleated = false;
  var i, j, k, hash, left, right, lr;

  if (size === 0) {
    hash = new Buffer(32);
    hash.fill(0);
    nodes.push(hash);
    return new MerkleTree(nodes, malleated);
  }

  lr = new Buffer(64);

  for (j = 0; size > 1; size = ((size + 1) / 2) | 0) {
    for (i = 0; i < size; i += 2) {
      k = Math.min(i + 1, size - 1);
      left = nodes[j + i];
      right = nodes[j + k];

      if (k === i + 1 && k + 1 === size
          && left.compare(right) === 0) {
        malleated = true;
      }

      left.copy(lr, 0);
      right.copy(lr, 32);

      hash = crypto.hash256(lr);

      nodes.push(hash);
    }
    j += size;
  }

  return new MerkleTree(nodes, malleated);
};

if (native)
  crypto.createMerkleTree = native.createMerkleTree;

/**
 * Calculate merkle root from leaves.
 * @param {Buffer[]} leaves
 * @returns {MerkleRoot}
 */

crypto.createMerkleRoot = function createMerkleRoot(leaves) {
  var tree = crypto.createMerkleTree(leaves);
  var hash = tree.nodes[tree.nodes.length - 1];
  var malleated = tree.malleated;
  return new MerkleRoot(hash, malleated);
};

/**
 * Collect a merkle branch at vector index.
 * @param {Number} index
 * @param {Buffer[]} leaves
 * @returns {Buffer[]} branch
 */

crypto.createMerkleBranch = function createMerkleBranch(index, leaves) {
  var size = leaves.length;
  var tree = crypto.createMerkleTree(leaves);
  var branch = [];
  var j = 0;
  var i;

  for (; size > 1; size = (size + 1) / 2 | 0) {
    i = Math.min(index ^ 1, size - 1);
    branch.push(tree.nodes[j + i]);
    index >>>= 1;
    j += size;
  }

  return branch;
};

/**
 * Check a merkle branch at vector index.
 * @param {Buffer} hash
 * @param {Buffer[]} branch
 * @param {Number} index
 * @returns {Buffer} Hash.
 */

crypto.verifyMerkleBranch = function verifyMerkleBranch(hash, branch, index) {
  var i, otherside, lr;

  if (branch.length === 0)
    return hash;

  lr = new Buffer(64);

  for (i = 0; i < branch.length; i++) {
    otherside = branch[i];

    if (index & 1) {
      otherside.copy(lr, 0);
      hash.copy(lr, 32);
    } else {
      hash.copy(lr, 0);
      otherside.copy(lr, 32);
    }

    hash = crypto.hash256(lr);
    index >>>= 1;
  }

  return hash;
};

if (native)
  crypto.verifyMerkleBranch = native.verifyMerkleBranch;

/**
 * Encrypt with aes-256-cbc.
 * @function
 * @param {Buffer} data
 * @param {Buffer} key - 256 bit key.
 * @param {Buffer} iv - 128 bit initialization vector.
 * @returns {Buffer}
 */

crypto.encipher = backend.encipher;

/**
 * Decrypt with aes-256-cbc.
 * @function
 * @param {Buffer} data
 * @param {Buffer} key - 256 bit key.
 * @param {Buffer} iv - 128 bit initialization vector.
 * @returns {Buffer}
 */

crypto.decipher = backend.decipher;

/**
 * memcmp in constant time (can only return true or false).
 * This protects us against timing attacks when
 * comparing an input against a secret string.
 * @see https://cryptocoding.net/index.php/Coding_rules
 * @see `$ man 3 memcmp` (NetBSD's consttime_memequal)
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Boolean}
 */

crypto.ccmp = function ccmp(a, b) {
  var i, res;

  if (!Buffer.isBuffer(a))
    return false;

  if (!Buffer.isBuffer(b))
    return false;

  if (b.length === 0)
    return a.length === 0;

  res = a.length ^ b.length;

  for (i = 0; i < a.length; i++)
    res |= a[i] ^ b[i % b.length];

  return res === 0;
};

/**
 * A maybe-secure memzero.
 * @param {Buffer} data
 */

crypto.cleanse = function cleanse(data) {
  var ctr = crypto._counter;
  var i;

  for (i = 0; i < data.length; i++) {
    data[i] = ctr & 0xff;
    ctr += i;
  }

  crypto._counter = ctr >>> 0;
};

crypto._counter = 0;

if (native)
  crypto.cleanse = native.cleanse;

/**
 * Generate some random bytes.
 * @function
 * @param {Number} size
 * @returns {Buffer}
 */

crypto.randomBytes = backend.randomBytes;

/**
 * Generate a random uint32.
 * Probably more cryptographically sound than
 * `Math.random()`.
 * @function
 * @returns {Number}
 */

crypto.randomInt = function randomInt() {
  return crypto.randomBytes(4).readUInt32LE(0, true);
};

/**
 * Generate a random number within a range.
 * Probably more cryptographically sound than
 * `Math.random()`.
 * @function
 * @param {Number} min - Inclusive.
 * @param {Number} max - Exclusive.
 * @returns {Number}
 */

crypto.randomRange = function randomRange(min, max) {
  var num = crypto.randomInt();
  return Math.floor((num / 0x100000000) * (max - min) + min);
};

/**
 * Merkle Tree
 * @constructor
 * @ignore
 * @param {Buffer[]} nodes
 * @param {Boolean} malleated
 */

function MerkleTree(nodes, malleated) {
  this.nodes = nodes;
  this.malleated = malleated;
}

/**
 * Merkle Root
 * @constructor
 * @ignore
 * @param {Buffer} hash
 * @param {Boolean} malleated
 */

function MerkleRoot(hash, malleated) {
  this.hash = hash;
  this.malleated = malleated;
}

}).call(this,require("buffer").Buffer)
},{"../utils/native":9,"./backend":11,"./scrypt":13,"buffer":3}],13:[function(require,module,exports){
(function (Buffer){
/*!
 * scrypt.js - scrypt for bcoin
 * Copyright (c) 2016-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 *
 * Ported from:
 * https://github.com/Tarsnap/scrypt/blob/master/lib/crypto/crypto_scrypt-ref.c
 *
 * Copyright 2009 Colin Percival
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

'use strict';

/**
 * @module crypto/scrypt
 * @ignore
 */

var co = require('../utils/co');
var backend = require('./backend');
var native = require('../utils/native').binding;
var U32Array = typeof Uint32Array === 'function' ? Uint32Array : Array;
var scryptAsync, smixAsync;

/**
 * Javascript scrypt implementation. Scrypt is
 * used in bip38. Bcoin doesn't support bip38
 * yet, but here it is, just in case.
 * @alias module:crypto/scrypt.scrypt
 * @param {Buffer} passwd
 * @param {Buffer} salt
 * @param {Number} N
 * @param {Number} r
 * @param {Number} p
 * @param {Number} len
 * @returns {Buffer}
 */

function scrypt(passwd, salt, N, r, p, len) {
  var i, B, V, XY;

  if (r * p >= (1 << 30))
    throw new Error('EFBIG');

  if ((N & (N - 1)) !== 0 || N === 0)
    throw new Error('EINVAL');

  if (N > 0xffffffff)
    throw new Error('EINVAL');

  XY = new Buffer(256 * r);
  V = new Buffer(128 * r * N);

  B = backend.pbkdf2(passwd, salt, 1, p * 128 * r, 'sha256');

  for (i = 0; i < p; i++)
    smix(B, i * 128 * r, r, N, V, XY);

  return backend.pbkdf2(passwd, B, 1, len, 'sha256');
}

if (native)
  scrypt = native.scrypt;

function salsa20_8(B) {
  var B32 = new U32Array(16);
  var x = new U32Array(16);
  var i;

  for (i = 0; i < 16; i++)
    B32[i] = B.readUInt32LE(i * 4, true);

  for (i = 0; i < 16; i++)
    x[i] = B32[i];

  for (i = 0; i < 8; i += 2) {
    x[4] ^= R(x[0] + x[12], 7);
    x[8] ^= R(x[4] + x[0], 9);
    x[12] ^= R(x[8] + x[4], 13);
    x[0] ^= R(x[12] + x[8], 18);

    x[9] ^= R(x[5] + x[1], 7);
    x[13] ^= R(x[9] + x[5], 9);
    x[1] ^= R(x[13] + x[9], 13);
    x[5] ^= R(x[1] + x[13], 18);

    x[14] ^= R(x[10] + x[6], 7);
    x[2] ^= R(x[14] + x[10], 9);
    x[6] ^= R(x[2] + x[14], 13);
    x[10] ^= R(x[6] + x[2], 18);

    x[3] ^= R(x[15] + x[11], 7);
    x[7] ^= R(x[3] + x[15], 9);
    x[11] ^= R(x[7] + x[3], 13);
    x[15] ^= R(x[11] + x[7], 18);

    x[1] ^= R(x[0] + x[3], 7);
    x[2] ^= R(x[1] + x[0], 9);
    x[3] ^= R(x[2] + x[1], 13);
    x[0] ^= R(x[3] + x[2], 18);

    x[6] ^= R(x[5] + x[4], 7);
    x[7] ^= R(x[6] + x[5], 9);
    x[4] ^= R(x[7] + x[6], 13);
    x[5] ^= R(x[4] + x[7], 18);

    x[11] ^= R(x[10] + x[9], 7);
    x[8] ^= R(x[11] + x[10], 9);
    x[9] ^= R(x[8] + x[11], 13);
    x[10] ^= R(x[9] + x[8], 18);

    x[12] ^= R(x[15] + x[14], 7);
    x[13] ^= R(x[12] + x[15], 9);
    x[14] ^= R(x[13] + x[12], 13);
    x[15] ^= R(x[14] + x[13], 18);
  }

  for (i = 0; i < 16; i++)
    B32[i] += x[i];

  for (i = 0; i < 16; i++)
    B.writeUInt32LE(B32[i], 4 * i, true);
}

function R(a, b) {
  return (a << b) | (a >>> (32 - b));
}

function blockmix_salsa8(B, Y, Yo, r) {
  var X = new Buffer(64);
  var i;

  blkcpy(X, B, 0, (2 * r - 1) * 64, 64);

  for (i = 0; i < 2 * r; i++) {
    blkxor(X, B, 0, i * 64, 64);
    salsa20_8(X);
    blkcpy(Y, X, Yo + i * 64, 0, 64);
  }

  for (i = 0; i < r; i++)
    blkcpy(B, Y, i * 64, Yo + (i * 2) * 64, 64);

  for (i = 0; i < r; i++)
    blkcpy(B, Y, (i + r) * 64, Yo + (i * 2 + 1) * 64, 64);
}

function integerify(B, r) {
  return B.readUInt32LE((2 * r - 1) * 64, true);
}

function smix(B, Bo, r, N, V, XY) {
  var X = XY;
  var Y = XY;
  var i;
  var j;

  blkcpy(X, B, 0, Bo, 128 * r);

  for (i = 0; i < N; i++) {
    blkcpy(V, X, i * (128 * r), 0, 128 * r);
    blockmix_salsa8(X, Y, 128 * r, r);
  }

  for (i = 0; i < N; i++) {
    j = integerify(X, r) & (N - 1);
    blkxor(X, V, 0, j * (128 * r), 128 * r);
    blockmix_salsa8(X, Y, 128 * r, r);
  }

  blkcpy(B, X, Bo, 0, 128 * r);
}

function blkcpy(dest, src, s1, s2, len) {
  src.copy(dest, s1, s2, s2 + len);
}

function blkxor(dest, src, s1, s2, len) {
  for (var i = 0; i < len; i++)
    dest[s1 + i] ^= src[s2 + i];
}

/**
 * Asynchronous scrypt implementation.
 * @alias module:crypto/scrypt.scryptAsync
 * @function
 * @param {Buffer} passwd
 * @param {Buffer} salt
 * @param {Number} N
 * @param {Number} r
 * @param {Number} p
 * @param {Number} len
 * @returns {Promise}
 */

scryptAsync = co(function* scryptAsync(passwd, salt, N, r, p, len) {
  var i, B, V, XY;

  if (r * p >= (1 << 30))
    throw new Error('EFBIG');

  if ((N & (N - 1)) !== 0 || N === 0)
    throw new Error('EINVAL');

  if (N > 0xffffffff)
    throw new Error('EINVAL');

  XY = new Buffer(256 * r);
  V = new Buffer(128 * r * N);

  B = yield backend.pbkdf2Async(passwd, salt, 1, p * 128 * r, 'sha256');

  for (i = 0; i < p; i++)
    yield smixAsync(B, i * 128 * r, r, N, V, XY);

  return yield backend.pbkdf2Async(passwd, B, 1, len, 'sha256');
});

if (native)
  scryptAsync = native.scryptAsync;

smixAsync = co(function* smixAsync(B, Bo, r, N, V, XY) {
  var X = XY;
  var Y = XY;
  var i;
  var j;

  blkcpy(X, B, 0, Bo, 128 * r);

  for (i = 0; i < N; i++) {
    blkcpy(V, X, i * (128 * r), 0, 128 * r);
    blockmix_salsa8(X, Y, 128 * r, r);
    yield co.wait();
  }

  for (i = 0; i < N; i++) {
    j = integerify(X, r) & (N - 1);
    blkxor(X, V, 0, j * (128 * r), 128 * r);
    blockmix_salsa8(X, Y, 128 * r, r);
    yield co.wait();
  }

  blkcpy(B, X, Bo, 0, 128 * r);
});

/*
 * Expose
 */

exports = scrypt;
exports.scrypt = scrypt;
exports.scryptAsync = scryptAsync;

module.exports = exports;

}).call(this,require("buffer").Buffer)
},{"../utils/co":16,"../utils/native":9,"./backend":11,"buffer":3}],14:[function(require,module,exports){
(function (Buffer){
/*!
 * sha256.js - SHA256 implementation for bcoin
 * Copyright (c) 2016-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 * Parts of this software based on hash.js.
 */

'use strict';

/**
 * @module crypto/sha256
 * @ignore
 */

/*
 * Constants
 */

var DESC = new Buffer(8);
var BUFFER64 = new Buffer(64);
var K, PADDING;
var ctx, mctx;

PADDING = new Buffer(64);
PADDING.fill(0);
PADDING[0] = 0x80;

K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

/**
 * SHA256
 * @alias module:crypto/sha256.SHA256
 * @constructor
 * @property {Number[]} s
 * @property {Number[]} w
 * @property {Buffer} block
 * @property {Number} bytes
 */

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  this.s = new Array(8);
  this.w = new Array(64);
  this.block = new Buffer(64);
  this.bytes = 0;
}

/**
 * Initialize SHA256 context.
 */

SHA256.prototype.init = function init() {
  this.s[0] = 0x6a09e667;
  this.s[1] = 0xbb67ae85;
  this.s[2] = 0x3c6ef372;
  this.s[3] = 0xa54ff53a;
  this.s[4] = 0x510e527f;
  this.s[5] = 0x9b05688c;
  this.s[6] = 0x1f83d9ab;
  this.s[7] = 0x5be0cd19;
  this.bytes = 0;
};

/**
 * Update SHA256 context.
 * @param {Buffer} data
 */

SHA256.prototype.update = function update(data) {
  return this._update(data, data.length);
};

/**
 * Finalize SHA256 context.
 * @returns {Buffer}
 */

SHA256.prototype.finish = function finish() {
  return this._finish(new Buffer(32));
};

/**
 * Update SHA256 context.
 * @private
 * @param {Buffer} data
 * @param {Number} len
 */

SHA256.prototype._update = function update(data, len) {
  var size = this.bytes & 0x3f;
  var pos = 0;
  var i, want;

  this.bytes += len;

  if (size > 0) {
    want = 64 - size;

    if (want > len)
      want = len;

    for (i = 0; i < want; i++)
      this.block[size + i] = data[i];

    size += want;
    len -= want;
    pos += want;

    if (size < 64)
      return;

    this.transform(this.block, 0);
  }

  while (len >= 64) {
    this.transform(data, pos);
    pos += 64;
    len -= 64;
  }

  for (i = 0; i < len; i++)
    this.block[i] = data[pos + i];
};

/**
 * Finalize SHA256 context.
 * @private
 * @param {Buffer} out
 * @returns {Buffer}
 */

SHA256.prototype._finish = function _finish(out) {
  var i;

  writeU32(DESC, this.bytes >>> 29, 0);
  writeU32(DESC, this.bytes << 3, 4);

  this._update(PADDING, 1 + ((119 - (this.bytes % 64)) % 64));
  this._update(DESC, 8);

  for (i = 0; i < 8; i++) {
    writeU32(out, this.s[i], i * 4);
    this.s[i] = 0;
  }

  return out;
};

/**
 * Transform SHA256 block.
 * @param {Buffer} chunk
 * @param {Number} pos
 */

SHA256.prototype.transform = function transform(chunk, pos) {
  var a = this.s[0];
  var b = this.s[1];
  var c = this.s[2];
  var d = this.s[3];
  var e = this.s[4];
  var f = this.s[5];
  var g = this.s[6];
  var h = this.s[7];
  var w = this.w;
  var i, t1, t2;

  for (i = 0; i < 16; i++)
    w[i] = readU32(chunk, pos + i * 4);

  for (; i < 64; i++)
    w[i] = sigma1(w[i - 2]) + w[i - 7] + sigma0(w[i - 15]) + w[i - 16];

  for (i = 0; i < 64; i++) {
    t1 = h + Sigma1(e);
    t1 += Ch(e, f, g);
    t1 += K[i] + w[i];

    t2 = Sigma0(a);
    t2 += Maj(a, b, c);

    h = g;
    g = f;
    f = e;

    e = d + t1;

    d = c;
    c = b;
    b = a;

    a = t1 + t2;
  }

  this.s[0] += a;
  this.s[1] += b;
  this.s[2] += c;
  this.s[3] += d;
  this.s[4] += e;
  this.s[5] += f;
  this.s[6] += g;
  this.s[7] += h;

  this.s[0] >>>= 0;
  this.s[1] >>>= 0;
  this.s[2] >>>= 0;
  this.s[3] >>>= 0;
  this.s[4] >>>= 0;
  this.s[5] >>>= 0;
  this.s[6] >>>= 0;
  this.s[7] >>>= 0;
};

/**
 * SHA256Hmac
 * @alias module:crypto/sha256.SHA256Hmac
 * @constructor
 * @property {SHA256} inner
 * @property {SHA256} outer
 */

function SHA256Hmac() {
  if (!(this instanceof SHA256Hmac))
    return new SHA256Hmac();

  this.inner = new SHA256();
  this.outer = new SHA256();
}

/**
 * Initialize HMAC context.
 * @param {Buffer} data
 */

SHA256Hmac.prototype.init = function init(data) {
  var key = BUFFER64;
  var i;

  if (data.length > 64) {
    this.inner.init();
    this.inner.update(data);
    this.inner._finish(key);
    key.fill(0, 32, 64);
  } else {
    data.copy(key, 0);
    key.fill(0, data.length, 64);
  }

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;

  this.inner.init();
  this.inner.update(key);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;

  this.outer.init();
  this.outer.update(key);
};

/**
 * Update HMAC context.
 * @param {Buffer} data
 */

SHA256Hmac.prototype.update = function update(data) {
  this.inner.update(data);
};

/**
 * Finalize HMAC context.
 * @returns {Buffer}
 */

SHA256Hmac.prototype.finish = function finish() {
  this.outer.update(this.inner.finish());
  return this.outer.finish();
};

/*
 * Helpers
 * @see https://github.com/bitcoin-core/secp256k1/blob/master/src/hash_impl.h
 */

function Sigma0(x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
}

function Sigma1(x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
}

function sigma0(x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3);
}

function sigma1(x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10);
}

function Ch(x, y, z) {
  return z ^ (x & (y ^ z));
}

function Maj(x, y, z) {
  return (x & y) | (z & (x | y));
}

function writeU32(buf, value, offset) {
  buf[offset] = value >>> 24;
  buf[offset + 1] = (value >> 16) & 0xff;
  buf[offset + 2] = (value >> 8) & 0xff;
  buf[offset + 3] = value & 0xff;
}

function readU32(buf, offset) {
  return ((buf[offset] & 0xff) * 0x1000000)
    + ((buf[offset + 1] & 0xff) << 16)
    | ((buf[offset + 2] & 0xff) << 8)
    | (buf[offset + 3] & 0xff);
}

/*
 * Context Helpers
 */

ctx = new SHA256();
mctx = new SHA256Hmac();

/**
 * Hash buffer with sha256.
 * @alias module:crypto/sha256.sha256
 * @param {Buffer} data
 * @returns {Buffer}
 */

function sha256(data) {
  ctx.init();
  ctx.update(data);
  return ctx.finish();
}

/**
 * Hash buffer with double sha256.
 * @alias module:crypto/sha256.hash256
 * @param {Buffer} data
 * @returns {Buffer}
 */

function hash256(data) {
  var out = new Buffer(32);
  ctx.init();
  ctx.update(data);
  ctx._finish(out);
  ctx.init();
  ctx.update(out);
  ctx._finish(out);
  return out;
}

/**
 * Create a sha256 HMAC from buffer and key.
 * @alias module:crypto/sha256.hmac
 * @param {Buffer} data
 * @param {Buffer} key
 * @returns {Buffer}
 */

function hmac(data, key) {
  mctx.init(key);
  mctx.update(data);
  return mctx.finish();
}

/*
 * Expose
 */

exports = SHA256;
exports.SHA256 = SHA256;
exports.SHA256Hmac = SHA256Hmac;
exports.digest = sha256;
exports.hmac = hmac;
exports.hash256 = hash256;

module.exports = exports;

}).call(this,require("buffer").Buffer)
},{"buffer":3}],15:[function(require,module,exports){
/*!
 * mine.js - mining function for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

var assert = require('assert');
var crypto = require('../crypto/crypto');

/**
 * Hash until the nonce overflows.
 * @alias module:mining.mine
 * @param {Buffer} data
 * @param {Buffer} target - Big endian.
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} Nonce or -1.
 */

function mine(data, target, min, max) {
  var nonce = min;

  data.writeUInt32LE(nonce, 76, true);

  // The heart and soul of the miner: match the target.
  while (nonce <= max) {
    // Hash and test against the next target.
    if (rcmp(crypto.hash256(data), target) <= 0)
      return nonce;

    // Increment the nonce to get a different hash.
    nonce++;

    // Update the raw buffer.
    data.writeUInt32LE(nonce, 76, true);
  }

  return -1;
}

window.mine = mine;

/**
 * "Reverse" comparison so we don't have
 * to waste time reversing the block hash.
 * @ignore
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Number}
 */

function rcmp(a, b) {
  var i;

  assert(a.length === b.length);

  for (i = a.length - 1; i >= 0; i--) {
    if (a[i] < b[i])
      return -1;
    if (a[i] > b[i])
      return 1;
  }

  return 0;
}

/*
 * Expose
 */

module.exports = mine;

},{"../crypto/crypto":12,"assert":1}],16:[function(require,module,exports){
(function (process){
/*!
 * co.js - promise and generator control flow for bcoin
 * Originally based on yoursnetwork's "asink" module.
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/**
 * @module utils/co
 */

var nextTick = require('./nexttick');
var every;

/**
 * Execute an instantiated generator.
 * @param {Generator} gen
 * @returns {Promise}
 */

function exec(gen) {
  return new Promise(function(resolve, reject) {
    function step(value, rejection) {
      var next;

      try {
        if (rejection)
          next = gen.throw(value);
        else
          next = gen.next(value);
      } catch (e) {
        reject(e);
        return;
      }

      if (next.done) {
        resolve(next.value);
        return;
      }

      if (!isPromise(next.value)) {
        step(next.value, false);
        return;
      }

      next.value.then(succeed, fail);
    }

    function succeed(value) {
      step(value, false);
    }

    function fail(value) {
      step(value, true);
    }

    step(undefined, false);
  });
}

/**
 * Execute generator function
 * with a context and execute.
 * @param {GeneratorFunction} generator
 * @param {Object} ctx
 * @returns {Promise}
 */

function spawn(generator, ctx) {
  var gen = generator.call(ctx);
  return exec(gen);
}

/**
 * Wrap a generator function to be
 * executed into a function that
 * returns a promise.
 * @param {GeneratorFunction}
 * @returns {Function}
 */

function co(generator) {
  return function() {
    var gen = generator.apply(this, arguments);
    return exec(gen);
  };
}

/**
 * Test whether an object is a promise.
 * @param {Object} obj
 * @returns {Boolean}
 */

function isPromise(obj) {
  return obj && typeof obj.then === 'function';
}

/**
 * Wrap a generator function to be
 * executed into a function that
 * accepts a node.js style callback.
 * @param {GeneratorFunction}
 * @returns {Function}
 */

function cob(generator) {
  return function(_) {
    var i, args, callback, gen;

    if (arguments.length === 0
        || typeof arguments[arguments.length - 1] !== 'function') {
      throw new Error((generator.name || 'Function') + ' requires a callback.');
    }

    args = new Array(arguments.length - 1);
    callback = arguments[arguments.length - 1];

    for (i = 0; i < args.length; i++)
      args[i] = arguments[i];

    gen = generator.apply(this, args);

    exec(gen).then(function(value) {
      nextTick(function() {
        callback(null, value);
      });
    }, function(err) {
      nextTick(function() {
        callback(err);
      });
    });
  };
}

/**
 * Wait for a nextTick with a promise.
 * @returns {Promise}
 */

function wait() {
  return new Promise(tick);
};

/**
 * Wait for a nextTick.
 * @private
 * @param {Function} resolve
 * @param {Function} reject
 */

function tick(resolve, reject) {
  nextTick(resolve);
}

/**
 * Wait for a timeout with a promise.
 * @param {Number} time
 * @returns {Promise}
 */

function timeout(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, time);
  });
}

/**
 * Wrap `resolve` and `reject` into
 * a node.js style callback.
 * @param {Function} resolve
 * @param {Function} reject
 * @returns {Function}
 */

function wrap(resolve, reject) {
  return function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  };
}

/**
 * Wrap a function that accepts node.js
 * style callbacks into a function that
 * returns a promise.
 * @param {Function} func
 * @param {Object?} ctx
 * @returns {Function}
 */

function promisify(func, ctx) {
  return function() {
    var self = this;
    var args = new Array(arguments.length);
    var i;

    for (i = 0; i < arguments.length; i++)
      args[i] = arguments[i];

    return new Promise(function(resolve, reject) {
      args.push(wrap(resolve, reject));
      func.apply(ctx || self, args);
    });
  };
}

/**
 * Execute each promise and
 * have them pass a truth test.
 * @method
 * @param {Promise[]} jobs
 * @returns {Promise}
 */

every = co(function* every(jobs) {
  var result = yield Promise.all(jobs);
  var i;

  for (i = 0; i < result.length; i++) {
    if (!result[i])
      return false;
  }

  return true;
});

/**
 * Create a job object.
 * @returns {Job}
 */

function job(resolve, reject) {
  return new Job(resolve, reject);
}

/**
 * Job
 * @constructor
 * @ignore
 * @param {Function} resolve
 * @param {Function} reject
 * @property {Function} resolve
 * @property {Function} reject
 */

function Job(resolve, reject) {
  this.resolve = resolve;
  this.reject = reject;
}

/*
 * This drives me nuts.
 */

if (typeof window !== 'undefined' && window) {
  window.onunhandledrejection = function(event) {
    throw event.reason;
  };
} else if (typeof process !== 'undefined' && process) {
  process.on('unhandledRejection', function(err, promise) {
    throw err;
  });
}

/*
 * Expose
 */

exports = co;
exports.exec = exec;
exports.spawn = spawn;
exports.co = co;
exports.cob = cob;
exports.wait = wait;
exports.timeout = timeout;
exports.wrap = wrap;
exports.promisify = promisify;
exports.every = every;
exports.job = job;

module.exports = exports;

}).call(this,require('_process'))
},{"./nexttick":17,"_process":5}],17:[function(require,module,exports){
/*!
 * nexttick.js - setimmediate for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

module.exports = require('../../vendor/setimmediate');

},{"../../vendor/setimmediate":26}],18:[function(require,module,exports){
(function (process,global,Buffer){
/*!
 * util.js - utils for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/* global gc */

var assert = require('assert');
var nodeUtil = require('util');
var fs = require('fs');
var os = require('os');
var Number, Math, Date;

/**
 * @exports utils/util
 */

var util = exports;

/**
 * Reference to the global object.
 * @const {Object}
 */

util.global = (function() {
  /* global self */

  if (this)
    return this;

  if (typeof window !== 'undefined')
    return window;

  if (typeof self !== 'undefined')
    return self;

  if (typeof global !== 'undefined')
    return global;

  assert(false, 'No global defined.');
})();

/*
 * Globals
 */

Number = util.global.Number;
Math = util.global.Math;
Date = util.global.Date;

/**
 * Whether we're in a browser or not.
 * @const {Boolean}
 */

util.isBrowser =
  (typeof process !== 'undefined' && process.browser)
  || typeof window !== 'undefined';

/**
 * The home directory.
 * @const {String}
 */

if (os.homedir) {
  util.HOME = os.homedir();
} else {
  util.HOME = process.env.HOME
    || process.env.USERPROFILE
    || process.env.HOMEPATH
    || '/';
}

/**
 * Global NOP function.
 * @type function
 * @static
 * @method
 */

util.nop = function() {};

/**
 * Garbage collector for `--expose-gc`.
 * @type function
 * @static
 * @method
 */

util.gc = !util.isBrowser && typeof gc === 'function' ? gc : util.nop;

/**
 * Clone a buffer.
 * @param {Buffer} data
 * @returns {Buffer}
 */

util.copy = function copy(data) {
  var clone = new Buffer(data.length);
  data.copy(clone, 0, 0, data.length);
  return clone;
};

/**
 * Concatenate two buffers.
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Buffer}
 */

util.concat = function concat(a, b) {
  var data = new Buffer(a.length + b.length);
  a.copy(data, 0);
  b.copy(data, a.length);
  return data;
};

/**
 * Test whether a string is base58 (note that you
 * may get a false positive on a hex string).
 * @param {String?} obj
 * @returns {Boolean}
 */

util.isBase58 = function isBase58(obj) {
  return typeof obj === 'string' && /^[1-9a-zA-Z]+$/.test(obj);
};

/**
 * Return hrtime (shim for browser).
 * @param {Array} time
 * @returns {Array}
 */

util.hrtime = function hrtime(time) {
  var now, ms, sec;

  if (util.isBrowser) {
    now = util.ms();
    if (time) {
      time = time[0] * 1000 + time[1] / 1e6;
      now -= time;
    }
    ms = now % 1000;
    sec = (now - ms) / 1000;
    return [sec, ms * 1e6];
  }

  if (time)
    return process.hrtime(time);

  return process.hrtime();
};

/**
 * Test whether a string is hex (length must be even).
 * Note that this _could_ yield a false positive on
 * base58 strings.
 * @param {String?} obj
 * @returns {Boolean}
 */

util.isHex = function isHex(obj) {
  return typeof obj === 'string'
    && /^[0-9a-f]+$/i.test(obj)
    && obj.length % 2 === 0;
};

/**
 * Test whether two buffers are equal.
 * @param {Buffer?} a
 * @param {Buffer?} b
 * @returns {Boolean}
 */

util.equal = function equal(a, b) {
  var i;

  if (a == null)
    return false;

  if (b == null)
    return false;

  assert(Buffer.isBuffer(a));
  assert(Buffer.isBuffer(b));

  if (a.compare)
    return a.compare(b) === 0;

  if (a.length !== b.length)
    return false;

  for (i = 0; i < a.length; i++) {
    if (a[i] !== b[i])
      return false;
  }

  return true;
};

/**
 * Call `setImmediate`, `process.nextTick`,
 * or `setInterval` depending.
 * @function
 * @returns {Promise}
 */

util.nextTick = require('./nexttick');

/**
 * Reverse a hex-string (used because of
 * bitcoind's affinity for uint256le).
 * @param {String} data - Hex string.
 * @returns {String} Reversed hex string.
 */

util.revHex = function revHex(data) {
  var out = '';
  var i;

  assert(typeof data === 'string');

  for (i = 0; i < data.length; i += 2)
    out = data.slice(i, i + 2) + out;

  return out;
};

/**
 * Shallow merge between multiple objects.
 * @param {Object} target
 * @param {...Object} args
 * @returns {Object} target
 */

util.merge = function merge(target) {
  var i, j, obj, keys, key;

  for (i = 1; i < arguments.length; i++) {
    obj = arguments[i];
    keys = Object.keys(obj);
    for (j = 0; j < keys.length; j++) {
      key = keys[j];
      target[key] = obj[key];
    }
  }

  return target;
};

if (Object.assign)
  util.merge = Object.assign;

/**
 * Max safe integer (53 bits).
 * @const {Number}
 * @default
 */

util.MAX_SAFE_INTEGER = 0x1fffffffffffff;

/**
 * Max 52 bit integer (safe for additions).
 * `(MAX_SAFE_INTEGER - 1) / 2`
 * @const {Number}
 * @default
 */

util.MAX_SAFE_ADDITION = 0xfffffffffffff;

/**
 * Test whether a number is below MAX_SAFE_INTEGER.
 * @param {Number} value
 * @returns {Boolean}
 */

util.isSafeInteger = function isSafeInteger(value) {
  if (Number.isSafeInteger)
    return Number.isSafeInteger(value);
  return Math.abs(value) <= util.MAX_SAFE_INTEGER;
};

/**
 * Test whether a number is Number,
 * finite, and below MAX_SAFE_INTEGER.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isNumber = function isNumber(value) {
  return typeof value === 'number'
    && isFinite(value)
    && util.isSafeInteger(value);
};

/**
 * Test whether an object is an int.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isInt = function isInt(value) {
  return util.isNumber(value) && value % 1 === 0;
};

/**
 * Test whether an object is an int8.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isInt8 = function isInt8(value) {
  return util.isInt(value) && Math.abs(value) <= 0x7f;
};

/**
 * Test whether an object is a uint8.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isUInt8 = function isUInt8(value) {
  return util.isInt(value) && value >= 0 && value <= 0xff;
};

/**
 * Test whether an object is an int32.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isInt32 = function isInt32(value) {
  return util.isInt(value) && Math.abs(value) <= 0x7fffffff;
};

/**
 * Test whether an object is a uint32.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isUInt32 = function isUInt32(value) {
  return util.isInt(value) && value >= 0 && value <= 0xffffffff;
};

/**
 * Test whether an object is a int53.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isInt53 = function isInt53(value) {
  return util.isInt(value);
};

/**
 * Test whether an object is a uint53.
 * @param {Number?} value
 * @returns {Boolean}
 */

util.isUInt53 = function isUInt53(value) {
  return util.isInt(value) && value >= 0;
};

/**
 * Test whether an object is a 160 bit hash (hex string).
 * @param {String?} value
 * @returns {Boolean}
 */

util.isHex160 = function isHex160(hash) {
  return util.isHex(hash) && hash.length === 40;
};

/**
 * Test whether an object is a 256 bit hash (hex string).
 * @param {String?} value
 * @returns {Boolean}
 */

util.isHex256 = function isHex256(hash) {
  return util.isHex(hash) && hash.length === 64;
};

/**
 * Test whether a string qualifies as a float.
 * @param {String?} value
 * @returns {Boolean}
 */

util.isFloat = function isFloat(value) {
  return typeof value === 'string'
    && /^-?(\d+)?(?:\.\d*)?$/.test(value)
    && value.length !== 0
    && value !== '-';
};

/**
 * util.inspect() with 20 levels of depth.
 * @param {Object|String} obj
 * @param {Boolean?} color
 * @return {String}
 */

util.inspectify = function inspectify(obj, color) {
  return typeof obj !== 'string'
    ? nodeUtil.inspect(obj, null, 20, color !== false)
    : obj;
};

/**
 * Format a string.
 * @function
 */

util.fmt = nodeUtil.format;

/**
 * Format a string.
 * @param {Array} args
 * @param {Boolean?} color
 * @return {String}
 */

util.format = function format(args, color) {
  if (color == null)
    color = process.stdout ? process.stdout.isTTY : false;

  return typeof args[0] === 'object'
    ? util.inspectify(args[0], color)
    : nodeUtil.format.apply(nodeUtil, args);
};

/**
 * Write a message to stdout (console in browser).
 * @param {Object|String} obj
 * @param {...String} args
 */

util.log = function log() {
  var args = new Array(arguments.length);
  var i, msg;

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  if (util.isBrowser) {
    msg = typeof args[0] !== 'object'
      ? util.format(args, false)
      : args[0];
    console.log(msg);
    return;
  }

  msg = util.format(args);
  process.stdout.write(msg + '\n');
};

/**
 * Write a message to stderr (console in browser).
 * @param {Object|String} obj
 * @param {...String} args
 */

util.error = function error() {
  var args = new Array(arguments.length);
  var i, msg;

  for (i = 0; i < args.length; i++)
    args[i] = arguments[i];

  if (util.isBrowser) {
    msg = typeof args[0] !== 'object'
      ? util.format(args, false)
      : args[0];
    console.error(msg);
    return;
  }

  msg = util.format(args);
  process.stderr.write(msg + '\n');
};

/**
 * Unique-ify an array of strings.
 * @param {String[]} obj
 * @returns {String[]}
 */

util.uniq = function uniq(obj) {
  var table = {};
  var out = [];
  var i = 0;

  for (; i < obj.length; i++) {
    if (!table[obj[i]]) {
      out.push(obj[i]);
      table[obj[i]] = true;
    }
  }

  return out;
};

/**
 * Get current time in unix time (seconds).
 * @returns {Number}
 */

util.now = function now() {
  return Math.floor(util.ms() / 1000);
};

/**
 * Get current time in unix time (milliseconds).
 * @returns {Number}
 */

util.ms = function ms() {
  if (Date.now)
    return Date.now();
  return +new Date();
};

/**
 * Create a Date ISO string from time in unix time (seconds).
 * @param {Number?} ts - Seconds in unix time.
 * @returns {String}
 */

util.date = function date(ts) {
  if (ts == null)
    ts = util.now();

  return new Date(ts * 1000).toISOString().slice(0, -5) + 'Z';
};

/**
 * Get unix seconds from a Date string.
 * @param {String} date - Date ISO String.
 * @returns {Number}
 */

util.time = function time(date) {
  if (date == null)
    return util.now();

  return new Date(date) / 1000 | 0;
};

/**
 * Get random range.
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */

util.random = function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Create a 64 bit nonce.
 * @returns {Buffer}
 */

util.nonce = function _nonce() {
  var nonce = new Buffer(8);
  var a = util.random(0, 0x100000000);
  var b = util.random(0, 0x100000000);

  nonce.writeUInt32LE(a, 0, true);
  nonce.writeUInt32LE(b, 4, true);

  return nonce;
};

/**
 * String comparator (memcmp + length comparison).
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Number} -1, 1, or 0.
 */

util.strcmp = function strcmp(a, b) {
  var len = Math.min(a.length, b.length);
  var i;

  for (i = 0; i < len; i++) {
    if (a[i] < b[i])
      return -1;
    if (a[i] > b[i])
      return 1;
  }

  if (a.length < b.length)
    return -1;

  if (a.length > b.length)
    return 1;

  return 0;
};

/**
 * Buffer comparator (memcmp + length comparison).
 * @param {Buffer} a
 * @param {Buffer} b
 * @returns {Number} -1, 1, or 0.
 */

util.cmp = function cmp(a, b) {
  return a.compare(b);
};

// Warning: polymorphism.
if (!Buffer.prototype.compare)
  util.cmp = util.strcmp;

/**
 * Convert bytes to mb.
 * @param {Number} size
 * @returns {Number} mb
 */

util.mb = function mb(size) {
  return Math.floor(size / 1024 / 1024);
};

/**
 * Inheritance.
 * @param {Function} obj - Constructor to inherit.
 * @param {Function} from - Parent constructor.
 */

util.inherits = function inherits(obj, from) {
  var f;

  obj.super_ = from;

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(obj.prototype, from.prototype);
    Object.defineProperty(obj.prototype, 'constructor', {
      value: obj,
      enumerable: false
    });
    return;
  }

  if (Object.create) {
    obj.prototype = Object.create(from.prototype, {
      constructor: {
        value: obj,
        enumerable: false
      }
    });
    return;
  }

  f = function() {};
  f.prototype = from.prototype;
  obj.prototype = new f;
  obj.prototype.constructor = obj;
};

/**
 * Find index of a buffer in an array of buffers.
 * @param {Buffer[]} obj
 * @param {Buffer} data - Target buffer to find.
 * @returns {Number} Index (-1 if not found).
 */

util.indexOf = function indexOf(obj, data) {
  var i;

  assert(Array.isArray(obj));
  assert(Buffer.isBuffer(data));

  for (i = 0; i < obj.length; i++) {
    if (!Buffer.isBuffer(obj[i]))
      continue;
    if (util.equal(obj[i], data))
      return i;
  }

  return -1;
};

/**
 * Convert a number to a padded uint8
 * string (3 digits in decimal).
 * @param {Number} num
 * @returns {String} Padded number.
 */

util.pad8 = function pad8(num) {
  assert(num >= 0);
  num = num + '';
  switch (num.length) {
    case 1:
      return '00' + num;
    case 2:
      return '0' + num;
    case 3:
      return num;
  }
  assert(false);
};

/**
 * Convert a number to a padded uint32
 * string (10 digits in decimal).
 * @param {Number} num
 * @returns {String} Padded number.
 */

util.pad32 = function pad32(num) {
  assert(num >= 0);
  num = num + '';
  switch (num.length) {
    case 1:
      return '000000000' + num;
    case 2:
      return '00000000' + num;
    case 3:
      return '0000000' + num;
    case 4:
      return '000000' + num;
    case 5:
      return '00000' + num;
    case 6:
      return '0000' + num;
    case 7:
      return '000' + num;
    case 8:
      return '00' + num;
    case 9:
      return '0' + num;
    case 10:
      return num;
    default:
      assert(false);
  }
};

/**
 * Convert a number to a padded uint8
 * string (2 digits in hex).
 * @param {Number} num
 * @returns {String} Padded number.
 */

util.hex8 = function hex8(num) {
  assert(num >= 0);
  num = num.toString(16);
  switch (num.length) {
    case 1:
      return '0' + num;
    case 2:
      return num;
    default:
      assert(false);
  }
};

/**
 * Convert a number to a padded uint32
 * string (8 digits in hex).
 * @param {Number} num
 * @returns {String} Padded number.
 */

util.hex32 = function hex32(num) {
  assert(num >= 0);
  num = num.toString(16);
  switch (num.length) {
    case 1:
      return '0000000' + num;
    case 2:
      return '000000' + num;
    case 3:
      return '00000' + num;
    case 4:
      return '0000' + num;
    case 5:
      return '000' + num;
    case 6:
      return '00' + num;
    case 7:
      return '0' + num;
    case 8:
      return num;
    default:
      assert(false);
  }
};

/**
 * Convert an array to a map.
 * @param {String[]} obj
 * @returns {Object} Map.
 */

util.toMap = function toMap(obj) {
  var map = {};
  var i, value;

  for (i = 0; i < obj.length; i++) {
    value = obj[i];
    map[value] = true;
  }

  return map;
};

/**
 * Reverse a map.
 * @param {Object} map
 * @returns {Object} Reversed map.
 */

util.revMap = function revMap(map) {
  var reversed = {};
  var keys = Object.keys(map);
  var i, key;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    reversed[map[key]] = key;
  }

  return reversed;
};

/**
 * Get object values.
 * @param {Object} map
 * @returns {Array} Values.
 */

util.values = function values(map) {
  var keys = Object.keys(map);
  var out = [];
  var i, key;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    out.push(map[key]);
  }

  return out;
};

/**
 * Perform a binary search on a sorted array.
 * @param {Array} items
 * @param {Object} key
 * @param {Function} compare
 * @param {Boolean?} insert
 * @returns {Number} Index.
 */

util.binarySearch = function binarySearch(items, key, compare, insert) {
  var start = 0;
  var end = items.length - 1;
  var pos, cmp;

  while (start <= end) {
    pos = (start + end) >>> 1;
    cmp = compare(items[pos], key);

    if (cmp === 0)
      return pos;

    if (cmp < 0)
      start = pos + 1;
    else
      end = pos - 1;
  }

  if (!insert)
    return -1;

  return start;
};

/**
 * Perform a binary insert on a sorted array.
 * @param {Array} items
 * @param {Object} item
 * @param {Function} compare
 * @returns {Number} index
 */

util.binaryInsert = function binaryInsert(items, item, compare, uniq) {
  var i = util.binarySearch(items, item, compare, true);

  if (uniq && i < items.length) {
    if (compare(items[i], item) === 0)
      return -1;
  }

  if (i === 0)
    items.unshift(item);
  else if (i === items.length)
    items.push(item);
  else
    items.splice(i, 0, item);

  return i;
};

/**
 * Perform a binary removal on a sorted array.
 * @param {Array} items
 * @param {Object} item
 * @param {Function} compare
 * @returns {Boolean}
 */

util.binaryRemove = function binaryRemove(items, item, compare) {
  var i = util.binarySearch(items, item, compare, false);
  if (i === -1)
    return false;
  items.splice(i, 1);
  return true;
};

/**
 * Unique-ify and sort an array of buffers.
 * @param {Buffer[]} items
 * @returns {Buffer[]}
 */

util.uniqBuffer = function uniqBuffer(items) {
  var out = [];
  var i, j, item;

  for (i = 0; i < items.length; i++) {
    item = items[i];
    j = util.binarySearch(out, item, util.cmp, true);

    if (j < out.length && util.cmp(out[j], item) === 0)
      continue;

    if (j === 0)
      out.unshift(item);
    else if (j === out.length)
      out.push(item);
    else
      out.splice(j, 0, item);
  }

  return out;
};

/**
 * Normalize a path.
 * @param {String} path
 * @param {Boolean?} dirname
 */

util.normalize = function normalize(path, dirname) {
  var parts;

  path = path.replace(/\\/g, '/');
  path = path.replace(/(^|\/)\.\//, '$1');
  path = path.replace(/\/+\.?$/, '');
  parts = path.split(/\/+/);

  if (dirname)
    parts.pop();

  return parts.join('/');
};

/**
 * Create a full directory structure.
 * @param {String} path
 */

util.mkdirp = function mkdirp(path) {
  var i, parts, stat;

  if (fs.unsupported)
    return;

  path = path.replace(/\\/g, '/');
  path = path.replace(/(^|\/)\.\//, '$1');
  path = path.replace(/\/+\.?$/, '');
  parts = path.split(/\/+/);
  path = '';

  if (process.platform === 'win32') {
    if (parts[0].indexOf(':') !== -1)
      path = parts.shift() + '/';
  }

  if (parts.length > 0) {
    if (parts[0].length === 0) {
      parts.shift();
      path = '/';
    }
  }

  for (i = 0; i < parts.length; i++) {
    path += parts[i];

    try {
      stat = fs.statSync(path);
      if (!stat.isDirectory())
        throw new Error('Could not create directory.');
    } catch (e) {
      if (e.code === 'ENOENT')
        fs.mkdirSync(path, 488 /* 0750 */);
      else
        throw e;
    }

    path += '/';
  }
};

/**
 * Ensure a directory.
 * @param {String} path
 * @param {Boolean?} dirname
 */

util.mkdir = function mkdir(path, dirname) {
  if (util.isBrowser)
    return;

  path = util.normalize(path, dirname);

  if (util._paths[path])
    return;

  util._paths[path] = true;

  return util.mkdirp(path);
};

/**
 * Cached mkdirp paths.
 * @private
 * @type {Object}
 */

util._paths = {};

/**
 * Ensure hidden-class mode for object.
 * @param {Object} obj
 */

util.fastProp = function fastProp(obj) {
  ({ __proto__: obj });
};

/**
 * Quick test to see if a string is uppercase.
 * @param {String} str
 * @returns {Boolean}
 */

util.isUpperCase = function isUpperCase(str) {
  if (str.length === 0)
    return false;
  return (str.charCodeAt(0) & 32) === 0;
};

/**
 * Test to see if a string starts with a prefix.
 * @param {String} str
 * @param {String} prefix
 * @returns {Boolean}
 */

util.startsWith = function startsWiths(str, prefix) {
  return str.startsWith(prefix);
};

if (!''.startsWith) {
  util.startsWith = function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
  };
}

/**
 * Promisify a function.
 * @param {Function} func
 * @returns {Function}
 */

util.promisify = function promisify(func) {
  return function() {
    var result;
    try {
      result = func.apply(this, arguments);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve(result);
  };
};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)
},{"./nexttick":17,"_process":5,"assert":1,"buffer":3,"fs":9,"os":9,"util":8}],19:[function(require,module,exports){
var hash = exports;

hash.utils = require('./hash/utils');
hash.common = require('./hash/common');
hash.sha = require('./hash/sha');
hash.ripemd = require('./hash/ripemd');
hash.hmac = require('./hash/hmac');

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;

},{"./hash/common":20,"./hash/hmac":21,"./hash/ripemd":22,"./hash/sha":23,"./hash/utils":24}],20:[function(require,module,exports){
var hash = require('../hash');
var utils = hash.utils;
var assert = utils.assert;

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};

},{"../hash":19}],21:[function(require,module,exports){
var hmac = exports;

var hash = require('../hash');
var utils = hash.utils;
var assert = utils.assert;

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (var i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (var i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};

},{"../hash":19}],22:[function(require,module,exports){
var hash = require('../hash');
var utils = hash.utils;

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = hash.common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];

},{"../hash":19}],23:[function(require,module,exports){
var hash = require('../hash');
var utils = hash.utils;
var assert = utils.assert;

var rotr32 = utils.rotr32;
var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;
var BlockHash = hash.common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [ 0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
exports.sha256 = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [ 0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
             0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
exports.sha224 = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [ 0x6a09e667, 0xf3bcc908,
             0xbb67ae85, 0x84caa73b,
             0x3c6ef372, 0xfe94f82b,
             0xa54ff53a, 0x5f1d36f1,
             0x510e527f, 0xade682d1,
             0x9b05688c, 0x2b3e6c1f,
             0x1f83d9ab, 0xfb41bd6b,
             0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
exports.sha512 = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(c0_hi, c0_lo,
                      c1_hi, c1_lo,
                      c2_hi, c2_lo,
                      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(c0_hi, c0_lo,
                          c1_hi, c1_lo,
                          c2_hi, c2_lo,
                          c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(c0_hi, c0_lo,
                           c1_hi, c1_lo,
                           c2_hi, c2_lo,
                           c3_hi, c3_lo,
                           c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(c0_hi, c0_lo,
                           c1_hi, c1_lo,
                           c2_hi, c2_lo,
                           c3_hi, c3_lo,
                           c4_hi, c4_lo);

    var c0_hi = s0_512_hi(ah, al);
    var c0_lo = s0_512_lo(ah, al);
    var c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    var c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [ 0xcbbb9d5d, 0xc1059ed8,
             0x629a292a, 0x367cd507,
             0x9159015a, 0x3070dd17,
             0x152fecd8, 0xf70e5939,
             0x67332667, 0xffc00b31,
             0x8eb44a87, 0x68581511,
             0xdb0c2e0d, 0x64f98fa7,
             0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
exports.sha384 = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe,
             0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
exports.sha1 = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (var i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}

function p32(x, y, z) {
  return x ^ y ^ z;
}

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}

function ch64_hi(xh, xl, yh, yl, zh, zl) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh, zl) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

},{"../hash":19}],24:[function(require,module,exports){
var utils = exports;
var inherits = require('inherits');

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = c & 0xff;
        if (hi)
          res.push(hi, lo);
        else
          res.push(lo);
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (var i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (var i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
utils.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
utils.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
utils.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
utils.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
utils.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
utils.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
utils.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
utils.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
utils.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
utils.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
utils.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
utils.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
utils.sum32_5 = sum32_5;

function assert(cond, msg) {
  if (!cond)
    throw new Error(msg || 'Assertion failed');
}
utils.assert = assert;

utils.inherits = inherits;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
};
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
};
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
};
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
};
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
};
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
};
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
};
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
};
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
};
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
};
exports.shr64_lo = shr64_lo;

},{"inherits":25}],25:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],26:[function(require,module,exports){
(function (process){
/*!
 * Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function(root, undefined) {
  "use strict";

  var global;

  if (typeof window !== "undefined")
    global = window;
  else if (typeof self !== "undefined")
    global = self;
  else
    global = root;

  if (!global)
    throw new Error("Global not found.");

  function install() {
    if (global.setImmediate) {
        return global.setImmediate;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    return setImmediate;
  }

  module.exports = install();
})(this);

}).call(this,require('_process'))
},{"_process":5}],27:[function(require,module,exports){
var mine = require('./node_modules/bcoin/lib/mining/mine.js');

new function() {
	var ws = null;
	var connected = false;

	var serverUrl;
	var connectionStatus;
	var sendMessage;

	var connectButton;
	var disconnectButton;
	var sendButton;

	var open = function() {
		var url = serverUrl.val();
		ws = new WebSocket(url);
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onmessage = onMessage;
		ws.onerror = onError;

		connectionStatus.text('OPENING ...');
		serverUrl.attr('disabled', 'disabled');
		connectButton.hide();
		disconnectButton.show();
	}

	var close = function() {
		if (ws) {
			console.log('CLOSING ...');
			ws.close();
		}
		connected = false;
		connectionStatus.text('CLOSED');

		serverUrl.removeAttr('disabled');
		connectButton.show();
		disconnectButton.hide();
		sendMessage.attr('disabled', 'disabled');
		sendButton.attr('disabled', 'disabled');
	}

	var clearLog = function() {
		$('#messages').html('');
	}

	var onOpen = function() {
		console.log('OPENED: ' + serverUrl.val());
		connected = true;
		connectionStatus.text('OPENED');
		sendMessage.removeAttr('disabled');
		sendButton.removeAttr('disabled');
	};

	var onClose = function() {
		console.log('CLOSED: ' + serverUrl.val());
		ws = null;
	};

	var onMessage = function(event) {
		var data = event.data;
		console.log(mine(data));
		addMessage(data);
	};

	var onError = function(event) {
		alert(event.data);
	}

	var addMessage = function(data, type) {
		var msg = $('<pre>').text(data);
		if (type === 'SENT') {
			msg.addClass('sent');
		}
		var messages = $('#messages');
		messages.append(msg);

		var msgBox = messages.get(0);
		while (msgBox.childNodes.length > 1000) {
			msgBox.removeChild(msgBox.firstChild);
		}
		msgBox.scrollTop = msgBox.scrollHeight;
	}

	WebSocketClient = {
		init: function() {
			serverUrl = $('#serverUrl');
			connectionStatus = $('#connectionStatus');
			sendMessage = $('#sendMessage');

			connectButton = $('#connectButton');
			disconnectButton = $('#disconnectButton');
			sendButton = $('#sendButton');

			connectButton.click(function(e) {
				close();
				open();
			});

			disconnectButton.click(function(e) {
				close();
			});

			sendButton.click(function(e) {
				var msg = $('#sendMessage').val();
				addMessage(msg, 'SENT');
				ws.send(msg);
			});

			$('#clearMessage').click(function(e) {
				clearLog();
			});

			var isCtrl;
			sendMessage.keyup(function (e) {
				if(e.which == 17) isCtrl=false;
			}).keydown(function (e) {
				if(e.which == 17) isCtrl=true;
				if(e.which == 13 && isCtrl == true) {
					sendButton.click();
					return false;
				}
			});
		}
	};
}

$(function() {
	WebSocketClient.init();
});

},{"./node_modules/bcoin/lib/mining/mine.js":15}]},{},[27]);
