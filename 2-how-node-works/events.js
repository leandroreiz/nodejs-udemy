const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

// Observers
myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Leandro Reis');
});

myEmitter.on('newSale', (payload) => {
  console.log(`There are now ${payload} items left in stock.`);
});

// Emits the event
myEmitter.emit('newSale', 9);

// --------------------------------

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request Received');
  res.end('Request Received');
});

server.on('request', (req, res) => {
  console.log('Another Request Received⚡');
});

server.on('close', () => {
  console.log('Server closed');
});

// Start server
server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});
