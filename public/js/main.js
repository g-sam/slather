const socket = io();

/* listen for arrow keys */
document.body.addEventListener('keydown', function (e) {
  e.preventDefault();
  const directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };
  socket.emit('turn', directions[e.keyCode]);
});

/* map data.positions object to array for binding to d3 selection */
function arrayify(obj){
  const arr = [];
   Object.keys(obj).forEach((x)=> {
    Object.keys(obj[x]).forEach((y)=> {
        arr.push({
          x, y,
          colour: obj[x][y].colour,
          key: `${x},${y}-${obj[x][y].id}`, 
        })
      });
    });
   return arr;
}

function getSnakeBB(snake){
  let [Xmin, Ymin, Xmax, Ymax] = [1000, 1000, 0, 0];
  snake.bits.forEach((bit) => {
    const [x, y] = bit;
    if (x < Xmin) Xmin = x; 
    if (y < Ymin) Ymin = y; 
    if (x > Xmax) Xmax = x; 
    if (y > Ymax) Ymax = y; 
  });
  const center = {
    x: Math.floor((Xmax - Xmin) / 2) + Xmin,
    y: Math.floor((Ymax - Ymin) / 2) + Ymin,
  };
  return {
    left: Xmin,
    right: Xmax,
    top: Ymin,
    bottom: Ymax,
    center,
  };
}

/* not used: does not appear smooth */
function setViewBoxBasedOnCenter(data){
  const snake = data.snakes[`/#${socket.id}`];
  const snakeBB = getSnakeBB(snake);
  const VBwidth = Math.floor(data.width / 6);
  const VBheight = Math.floor(data.height / 6);
  let VBx = snakeBB.center.x - VBwidth / 2;
  let VBy = snakeBB.center.y - VBheight / 2;
  if (VBx < 0) VBx = 0;
  if (VBy < 0) VBy = 0;
  if (VBx + VBwidth > 1000) VBx = data.width - VBwidth;
  if (VBy + VBheight > 1000) VBy = data.height - VBheight;
  const string = `${VBx} ${VBy} ${VBwidth} ${VBheight}`
  d3.select('.frame').attr('viewBox', string);
}

function setViewBox(data){
  const snake = data.snakes[`/#${socket.id}`];
  const VBwidth = Math.floor(data.width / 2);
  const VBheight = Math.floor(data.height / 2);
  let VBx = snake.head[0] - VBwidth / 2;
  let VBy = snake.head[1] - VBheight / 2;
  if (VBx < 0) VBx = 0;
  if (VBy < 0) VBy = 0;
  if (VBx + VBwidth > 1000) VBx = data.width - VBwidth;
  if (VBy + VBheight > 1000) VBy = data.height - VBheight;
  const string = `${VBx} ${VBy} ${VBwidth} ${VBheight}`
  d3.select('.frame').attr('viewBox', string);
}

function paint(data){
  const positions = arrayify(data.positions);
  const update = d3.select('.frame')
    .selectAll('rect')
    .data(positions, (d) => d.key)

  update.exit().remove();
  update.enter().append('rect')
    .attr('width', 1)
    .attr('height', 1)
    .attr('x', (d) => Number(d.x))
    .attr('y', (d) => Number(d.y))
    .attr('fill', (d) => d.colour);
}

/* update svg display */
socket.on('update', (data) => {
  setViewBox(data);
  paint(data);
});
