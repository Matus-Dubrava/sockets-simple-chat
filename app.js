const express = require('express');
const socket = require('socket.io');
const log = require('debug')('a:app');
const error = require('debug')('a:error');
const path = require('path');
const util = require('util');
const mongoose = require('mongoose');

const Message = require('./models/message');

const app = express();

function sanitizeMessage(message) {
  return { name: message.name, message: message.message };
}

mongoose.connect('mongodb://localhost:27017/sockets', () => {
  log(`Connection to database established.`);
});

app.set('port', process.env.PORT || 4000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/messages', async (req, res, next) => {
  const messages = await Message.find({});
  res.json(messages.map(sanitizeMessage));
});

const server = app.listen(app.get('port'), () => {
  log(`Server started listening in port ${app.get('port')}.`);
});

const io = socket(server);

io.on('connection', (socket) => {
  log(`Socket made for ${socket.id}`);

  socket.on('chat-message', async (data) => {
    log('RECEIVED: ' + util.inspect(data) + ', from: ' + socket.id);
    await new Message(data).save();

    io.emit('chat-message', data);
  });
});

module.exports = app;
