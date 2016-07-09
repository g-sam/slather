const startSize = 3;
const colours = ['red', 'green', 'black', 'blue', 'orange', 'green', 'purple', 'brown', 'pink'];
const width = 1000;
const height = 1000;
const snakes = {};
const positions = {};
const moved = {}
const toFill = [];
const toUnfill = [];

function onTick() {
  Object.keys(snakes).forEach(id){
   snakes[id].move();
  }
  moved = {};
}

function turn(id, direction){

  function valid(d1, d2) {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    if (moved[id]) return false;
    if (d1 === d2) return false;
    if (opposites[d1] === d2) return false;
    else return true;
  }
  if (valid(direction, snakes[id].direction)){
    snakes[id].direction = direction
    moved[id] = true;
  }
}

/* get start position of new snake */
function getStart() {
  let valid = true;
  let x;
  let y;
  do {
    x = Math.floor(Math.random()*width);
    y = Math.floor(Math.random()*height);
    for (let i = 0; i < Snake.startSize; i++){
      if (isFull(x, y - i)){ valid = false }
    }
  } while (!valid)
  return [x, y];
}

/* add new occupied positions */
function fill(bits, snake) {
  this.bits.forEach((bit) => {
    const [x, y] = bit;
    positions[x][y] = snake;
  });
}

function unFill(bit) {
    const [x, y] = bit;
    delete positions[x][y];
    if (positions[x] === {}) {
      delete positions[x];
    }
}

/* check if position is occupied */
function isFull(x, y) {
  if (positions.hasOwnProperty(x)) {
    if (positions[x].hasOwnProperty(y)) {
      return true
    }
  }
  return false;
}

/*  remove snake */
function kill(id){
  snakes[id].bits.forEach(unFill);
  delete snakes[id];
}

/* Snake constructor function */
function Snake(id) {
  snakes[id] = this;
  this.colour = colours[Math.floor(Math.random()*8)];
  this.size = startSize;
  this.direction = 'up';
  this.head = getStart();
  this.bits = [
    [this.head[0], this.head[1],
    [this.head[0], this.head[1] - 1],
    [this.head[0], this.head[1] - 2]
  ];
  fill(bits);
  this.move = () => {
    if(this.direction === 'up') this.head[1] += 1;
    if(this.direction === 'right') this.head[0] += 1;
    if(this.direction === 'down') this.head[1] -= 1;
    if(this.direction === 'left') this.head[0] -= 1;
    const popped = this.bits.pop();
    this.bits.unshift([this.head[0], this.head[1]]);
    fill(this.head);
    unFill(popped);
  }
  this.grow = (n) => {this.size += n};
}

module.exports = {
  Snake,
  turn,
  kill,
  positions,
  onTick,
}
