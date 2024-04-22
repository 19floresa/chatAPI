const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes');
app.use('', routes); // Prefix all routes

const server = http.createServer({ maxHeaderSize: 81920 }, app);
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
