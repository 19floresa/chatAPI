const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes');
app.use('', routes);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
