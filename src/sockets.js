const game = require('./game.js');
const server = require('./server.js');
const io = require('socket.io')(server);

const {Snake, turn, kill, data, onTick} = game;


/* socket events */
io.on('connection', (socket) => {
  const id = socket.id
  console.log(`client ${id} connected`)
  new Snake(id);
  socket.on('turn', (direction) => {
    turn(id, direction);
  });
  socket.on('disconnect', () => {
    kill(id, true);
    console.log(`client ${id} disconnected`)
  });
});

const ticker = setInterval(() => {
  onTick();
  io.emit('update', data)
}, 150);

