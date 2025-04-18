import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {checkDatabaseConnection} from './config/database.js';

import http from 'http';
import { initSocket } from './config/socket.js';
import {fileURLToPath} from 'url';
import gold from './routes/gold.js';
import { publishPrices } from './publishers/goldUpdatePublisher.js';
import { setupDbSubscriber } from './subscribers/dbSubscriber.js';
import { setupSocketSubscriber } from './subscribers/socketSubscriber.js';

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
app.use('/gold', gold);

setupDbSubscriber();
setupSocketSubscriber();

checkDatabaseConnection();

setInterval(publishPrices, 5000);

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
