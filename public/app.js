const socket = io();
const nameInput = document.querySelector('#name');
const join = document.querySelector('#join');
const message = document.querySelector('#message');
const send = document.querySelector('#send');
const form = document.querySelector('#form');
const messages = document.querySelector('#messages');
const users = document.querySelector('#users');
const count = document.querySelector('#count');
const status = document.querySelector('#status');

join.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return nameInput.focus();
  socket.emit('join', name);
  nameInput.disabled = true;
  join.disabled = true;
  message.disabled = false;
  send.disabled = false;
  status.textContent = 'Connected';
  message.focus();
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (!message.value.trim()) return;
  socket.emit('chat', message.value);
  message.value = '';
  message.focus();
};

socket.on('chat', ({ username, text }) => {
  const el = document.createElement('div');
  el.className = 'msg';
  const b = document.createElement('b');
  b.textContent = username;
  const p = document.createElement('p');
  p.textContent = text;
  el.append(b, p);
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('system', (text) => {
  const el = document.createElement('div');
  el.className = 'system';
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('users', (list) => {
  count.textContent = list.length;
  users.innerHTML = '';
  list.forEach((name) => {
    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'online';
    li.append(dot, document.createTextNode(name));
    users.appendChild(li);
  });
});

socket.on('connect', () => {
  if (!join.disabled) status.textContent = 'Ready to connect';
});
