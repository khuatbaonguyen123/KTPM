const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws')
const lib = require('./utils');

const app = express();
const port = 8080;

class PubSub {
    constructor() {
      this.subscribers = new Map();
    }
  
    subscribe(key, ws) {
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, new Set());
      }
      this.subscribers.get(key).add(ws);
    }
  
    unsubscribe(key, ws) {
      if (this.subscribers.has(key)) {
        this.subscribers.get(key).delete(ws);
        if (this.subscribers.get(key).size === 0) {
          this.subscribers.delete(key);
        }
      }
    }
  
    publish(key, value) {
      if (this.subscribers.has(key)) {
        this.subscribers.get(key).forEach(ws => {
          if (ws.isAlive) {
            ws.send(JSON.stringify({ key, value }));
          }
        });
      }
    }
  }

app.use(bodyParser.json());

const store = new Map();
const pubsub = new PubSub();

app.post('/add', async (req, res) => {
    try {
        const { key, value } = req.body;
        store.set(key, value);
        pubsub.publish(key, value);
        res.send('Insert a new record successfully');
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
    res.sendFile(path.join(__dirname, "viewer.html"));
});

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws, req) => {
  ws.isAlive = true;

  const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
  const key = urlParams.get('key');

  if (key) {
    pubsub.subscribe(key, ws);

    if (store.has(key)) {
      ws.send(JSON.stringify({ key, value: store.get(key) }));
    }
  }

  ws.on('close', () => {
    ws.isAlive = false;
    if (key) pubsub.unsubscribe(key, ws);
  });

  ws.on('error', console.error);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
