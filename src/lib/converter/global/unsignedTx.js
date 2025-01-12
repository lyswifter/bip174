'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const typeFields_1 = require('../../typeFields');
const Buffer = require('safe-buffer').Buffer;
function encode(data) {
  return {
    key: Buffer.from([typeFields_1.GlobalTypes.UNSIGNED_TX]),
    value: data.toBuffer(),
  };
}
exports.encode = encode;
