const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  //-------------------------------------------------------
  // Solution 2: Streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => res.end());
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!');
  // });
  //-------------------------------------------------------
  // Solution 3: Using pipe() to fix back pressure issue
  // Back pressure happens when the response can not send the data as fast as it is receiving it
  const readable = fs.createReadStream('test-file.txt');
  // readableSource.pipe(writeableDestination)
  readable.pipe(res);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening...');
});
