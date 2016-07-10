const startSize = 3;
const startApples = 150;
const colours = ['red', 'green', 'black', 'blue', 'orange', 'green', 'purple', 'brown', 'pink'];
const width = 1000;
const height = 1000;
const snakes = {};
const positions = {};
let moved = {}
let collisions = [];

generateApples(startApples);

function onTick() {
  Object.keys(snakes).forEach((id) => {
   snakes[id].move();
  });
  moved = {};
  collisions = [];
}

function checkCollisions(snake){

}

function generateApples(total){
  const applePositions = [];
  const apple = {
    apple: true,
    colour: 'darkgreen',
  };
  for (let i = 0; i < total; i++){
    let x;
    let y;
    do {
      x = Math.floor(Math.random()*width);
      y = Math.floor(Math.random()*height);
    } while (isFull(x, y))
    applePositions.push([x, y]);
  }
  fill(applePositions, apple);
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
function fill(bits, obj) {
  bits.forEach((bit) => {
    const [x, y] = bit;
    if (!positions.hasOwnProperty(x)){
      positions[x] = {};
    }
    positions[x][y] = obj;
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
  console.log(snakes)
  snakes[id].bits.forEach(unFill);
  delete snakes[id];
}

function pop(snake){
  const [x, y] = snake.head;
  if (isFull(x, y) && positions[x][y]['apple']){
    snake.grow();
  } else {
    const popped = snake.bits.pop();
    unFill(popped);
  }
}

function unshift(snake){
  const [x, y] = snake.head;
  if(isFull(x, y)){
    kill(snake.id);
  } else {
    snake.bits.unshift([x, y]);
    fill([snake.head], snake);
  }
}
/* Snake constructor function */
function Snake(id) {
  snakes[id] = this;
  this.id = id;
  this.colour = colours[Math.floor(Math.random()*8)];
  this.size = startSize;
  this.direction = 'up';
  this.head = getStart();
  this.bits = [
    [this.head[0], this.head[1]],
    [this.head[0], this.head[1] - 1],
    [this.head[0], this.head[1] - 2]
  ];
  fill(this.bits, this);
  this.move = () => {
    if(this.direction === 'down') this.head[1] += 1;
    if(this.direction === 'right') this.head[0] += 1;
    if(this.direction === 'up') this.head[1] -= 1;
    if(this.direction === 'left') this.head[0] -= 1;
    pop(this);  
    unshift(this);
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
