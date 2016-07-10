const socket = io();
const clientID = Date.now();
const oldPositions = {};


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

/* map positions object to array for binding to d3 selection */
function arrayify(obj){
  const arr = [];
   Object.keys(obj).forEach((x)=> {
    Object.keys(obj[x]).forEach((y)=> {
        arr.push({
          x,
          y,
          colour: obj[x][y].colour,
          key: `${x},${y}`, 
        })
      });
    });
   return arr;
}

/* update svg display */
socket.on('update', (positions) => {
  const data = arrayify(positions);
  const update = d3.select('.frame')
    .selectAll('rect')
    .data(data, (d) => d.key)

  update.exit().remove();
  update.enter().append('rect')
    .attr('width', 6)
    .attr('height', 6)
    .attr('x', (d) => Number(d.x) + 3)
    .attr('y', (d) => Number(d.y) + 3)
    .attr('fill', (d) => d.colour);
});
