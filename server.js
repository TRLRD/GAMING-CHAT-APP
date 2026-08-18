const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = new Map();

io.on('connection', (socket) => {
  socket.on('join', (name) => {
    const username = String(name || 'Player').trim().slice(0, 24) || 'Player';
    users.set(socket.id, username);
    socket.broadcast.emit('system', `${username} joined the lobby`);
    io.emit('users', [...users.values()]);
  });

  socket.on('chat', (message) => {
    const username = users.get(socket.id) || 'Player';
    const text = String(message || '').trim().slice(0, 500);
    if (text) io.emit('chat', { username, text });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    if (username) socket.broadcast.emit('system', `${username} left the lobby`);
    io.emit('users', [...users.values()]);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Gaming Chat App running on port ${PORT}`));
