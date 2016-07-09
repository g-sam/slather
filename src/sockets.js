const game = require('./game.js');
const server = require('./server.js');
const io = require('socket.io')(server);

const {Snake, turn, kill, positions, onTick} = game;


/* socket events */
io.on('connection', (socket) => {
  console.log(`client ${id} connected`)
  const id = socket.id
  new Snake(id);
  socket.on('turn', (direction) => {
    turn(id, direction);
  });
  socket.on('disconnect', () => {
    kill(id)
    console.log(`client ${id} disconnected`)
  });
});

const ticker = setInterval(() => {
  onTick();
  io.emit('update', positions)
}, 100);

