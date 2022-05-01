/**
 * A REST API (also known as RESTful API) is an application programming interface (API or web API) that conforms to the constraints of REST architectural style and allows for interaction with RESTful web services. REST stands for representational state transfer.
 */

const express = require('express');

const app = express();
const port = 3000;

// Methods
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.status(200).send('You can post to this endpoint :)');
});

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
