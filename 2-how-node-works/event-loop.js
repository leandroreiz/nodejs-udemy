const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

console.log('--- TOP-LEVEL CODE ---');

setTimeout(() => {
  console.log('2. Time 1 finished');
}, 0);

setImmediate(() => {
  console.log('3. Immediate 1 finished');
});

fs.readFile('test-file.txt', () => {
  console.log('4. I/O finished');
  console.log('--- INSIDE THE EVENT LOOP ---');

  setTimeout(() => {
    console.log('7. Time 2 finished');
  }, 0); //

  setTimeout(() => {
    console.log('8. Time 3 finished');
  }, 3000); //

  setImmediate(() => {
    console.log('6. Immediate 2 finished');
  });

  process.nextTick(() => console.log('5. process.nextTick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(`Password Encrypted in ${Date.now() - start}ms`);
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(`Password Encrypted in ${Date.now() - start}ms`);
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(`Password Encrypted in ${Date.now() - start}ms`);
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(`Password Encrypted in ${Date.now() - start}ms`);
  });
});

console.log('1. Hello from the top-level code');
