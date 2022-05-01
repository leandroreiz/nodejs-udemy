// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const Calc = require('./test-module-1');
const calc1 = new Calc();
console.log(calc1.add(2, 5)); // 7

// exports
// const calc2 = require('./test-module-2');
const { add, subtract, multiply, divide } = require('./test-module-2');

// console.log(calc2.multiply(2, 5)); // 10
console.log(add(2, 2));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
