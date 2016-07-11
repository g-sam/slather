const startSize = 3;
const startApples = 5000;
const colours = ['red', 'black', 'blue', 'orange', 'purple', 'brown', 'pink'];
const width = 50;
const height = 50;
const snakes = {};
const positions = {};
const data = {
  positions,
  snakes,
  width,
  height,
};
let moved = {}
let collisions = [];
let timedApples = {};
let applesToAdd = 0;


generateApples(startApples);

function onTick() {
  Object.keys(snakes).forEach((id) => {
    if(snakes[id].alive) snakes[id].move();
  });
  collisions.forEach((id)=> {
    console.log('why must I die?')
    kill(id);
  });
  Object.keys(timedApples).forEach((key) => {
    if(timedApples[key].timeLeft === 0){
      const bit = key.split(',').map(Number); 
      unFill(bit);
      delete timedApples[key];
    } else {
      timedApples[key].timeLeft -= 50;  
    }
  });
  generateApples(applesToAdd);
  moved = {};
  collisions = [];
  applesToAdd = 0;
}

function generateApples(total){
  const applePositions = [];
  const apple = {
    apple: true,
    id: 'apple',
    colour: 'green',
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

/* remove a bit from a position */
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

function decompose(snake){
  snake.bits.forEach((bit, i) => {
    const apple = {
      apple: true,
      id: 'apple',
      colour: 'green',
      timeLeft: 10000,
    };
    const [x, y] = bit;
    const key = `${x},${y}`;
    positions[x][y] = apple;
    timedApples[key] = apple;
  });
}

/*  remove snake */
function kill(id, disconnected){
  const snake = snakes[id];
  snake.alive = false;
  if(disconnected){
    snake.bits.forEach(unFill);
    delete snakes[id];
  } else {
    decompose(snake);
  }
}

/* if no apple, shorten snake at tail */
function pop(snake){
  const [x, y] = snake.head;
  if (isFull(x, y) && positions[x][y].hasOwnProperty('apple')){
    snake.grow(1);
    applesToAdd++;
  } else {
    const popped = snake.bits.pop();
    unFill(popped);
  }
}

/* if no collision, lengthen snake at head */
function unshift(snake){
  const [x, y] = snake.head;
  if(isFull(x, y) && !positions[x][y].hasOwnProperty('apple')){
    collisions.push(snake.id);
  } else if (x < 0 || y < 0 || x > 1000 || y > 1000) {
    collisions.push(snake.id);
  } else {
    snake.bits.unshift([x, y]);
    fill([snake.head], snake);
  }
}
/* Snake constructor function */
function Snake(id) {
  snakes[id] = this;
  this.id = id;
  this.alive = true;
  this.colour = colours[Math.floor(Math.random()*8)];
  this.size = startSize;
  this.direction = 'up';
  this.head = getStart();
  this.bits = [
    [this.head[0], this.head[1]],
    [this.head[0], this.head[1] + 1],
    [this.head[0], this.head[1] + 2]
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
  data,
  onTick,
}
