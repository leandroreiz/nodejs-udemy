// Core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// Third party modules
const slugify = require('slugify');
// My own modules
const replaceTemplate = require('./modules/replaceTemplate');

/*
// -----------------------------------------------
// Introduction to Node
// -----------------------------------------------
// Hello world in Nodejs
const hello = 'Hello Node!';
console.log(hello);

// -----------------------------------------------
// Blocking, synchronous
// -----------------------------------------------

// Reading files
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// Writting on files
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');

// -----------------------------------------------
// Non-Blocking, asynchronous
// -----------------------------------------------
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) return console.error('Something went wrong!');

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
      console.log(data3);

      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('Your file has been written 😁');
      });
    });
  });
});
console.log('Will read the file...');
*/
// -----------------------------------------------
// NODE FARM APPLICATION
// -----------------------------------------------

// Loading templates
// -----------------------------------------------
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// Reading the file synchronously
// Code on top level is executed only on first call
// -----------------------------------------------
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// -----------------------------------------------
// SERVER
// -----------------------------------------------
const server = http.createServer((req, res) => {
  // Code inside the server is executed for every request
  const { query, pathname } = url.parse(req.url, true);

  // Routes
  // ---------------------------------------------
  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // Application Programming Interface (API)
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Page not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'My-own-header': 'hello header',
    });
    res.end(`<h1 style=color:red>Page not found!</h1>`);
  }
});

// Server will be listening
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000...');
});
