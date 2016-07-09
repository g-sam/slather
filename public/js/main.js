const socket = io();
const clientID = Date.now();
const oldPositions = {};


function filter(positions){
  const additions = []
  Object.keys(positions).forEach((x)=>{
    Object.keys(positions[x]).forEach((y)=>{
      if(!oldPositions[x][y]){
        additions.push({
          x,
          y,
          colour: positions[x][y].colour  
        })
      };
    })
  })
  const removals = []
  Object.keys(oldPositions).forEach((x)=>{
    Object.keys(oldPositions[x]).forEach((y)=>{
      if(!positions[x][y]){
        removals.push({
          x,
          y,
        })
      };
    })
  })
  return [additions, removals];
}

function clone(positions){
  const out = {};
  Object.keys(positions).forEach((x)=>{
    Object.keys(positions[x]).forEach((y)=>{
      out[x][y] = positions[x][y];
    })
  })
  return out;
}

document.body.addEventListener('keydown', function (e) {
  const directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };
  socket.emit('turn', directions[e.keyCode]);
});

function arrayify(obj){
  const arr = [];
   Object.keys(obj).forEach((x)=> {
    Object.keys(obj[x]).forEach((y)=> {
        arr.push({
          x,
          y,
          colour: obj[x][y].colour,
          key: `${x},${y}`  
        })
      };
    });
   return arr;
}

socket.on('update', (positions) => {

  const data = arrayify(positions);
  const update = d3.select('.frame')
    .selectAll('rect')
    .data(data, (d) => d.key)

  update.exit().remove();
  update.enter().append('rect')
    .attr('width', 6);
    .attr('height', 6);
    .attr('x', (d) => d.x + 3);
    .attr('y', (d) => d.y + 3);

  /* TESTING
     const [additions, removals] = filter(positions);
     d3.select('.frame')
     .selectAll('rect')
     .data(additions)
     .enter()
     .append('rect')
     .attr('width', 6);
     .attr('height', 6);
     .attr('x', (d) => {
     return d.x + 3;
     });
     .attr('y', (d) => {
     return d.y + 3;
     });
     .attr('fill', (d) => {
     return d.colour;
     });
     d3.select('.frame')
     .data(removals)
     .attr('width', 6);
     .attr('height', 6);
     .attr('x', (d) => {
     return d.x + 3;
     });
     .attr('y', (d) => {
     return d.y + 3;
     });
     .attr('fill', (d) => {
     return d.colour;
     });
     oldPositions = positions;
     */
})
