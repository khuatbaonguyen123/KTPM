import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {checkDatabaseConnection} from './database.js';
import goldTypes from './routes/goldTypes.js';
import goldValues from './routes/goldValues.js';

// import lib from './utils.js';
import http from 'http';
import { initSocket } from './socket.js';
import {fileURLToPath} from 'url';

const port = 8080;

// Get the directory name
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
console.log(__fileName);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
initSocket(server);

app.use(bodyParser.json());

app.use('/gold-types', goldTypes);
app.use('/gold-values', goldValues);

checkDatabaseConnection();

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
