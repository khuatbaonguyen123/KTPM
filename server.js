import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import lib from './utils.js';
import http from 'http';
import {Server, Socket} from 'socket.io';
import {fileURLToPath} from 'url';

const port = 8080;

// Get the directory name
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
console.log(__fileName);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/add', async (req, res) => {
    try {
        const { key, value } = req.body;
        await lib.write(key, value);
        io.emit('valueUpdated', { key, value });  // Emit to all connected clients
        res.send("Insert a new record successfully!");
    } catch (err) {
        res.send(err.toString());
    }
});

app.get('/get/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const value = await lib.view(id);
        res.status(200).send(value);
    } catch (err) {
        res.send(err)
    }
});

app.get('/viewer/:id', (req, res) => {
    const id = req.params.id;
    res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
});

// Socket.IO event listener for connections
io.on('connection', (socket) => {
    console.log('A client connected');

    // Here you can emit a value to the client upon connection
    socket.emit('connected');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});