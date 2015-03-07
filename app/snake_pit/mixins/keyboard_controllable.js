var Controllable = require('./controllable');

var KeyboardControllable = function(viewport, socket) {
  // Mixin controllable
  Controllable.call(this);

  console.log('keyboard controllable')

  var directionMap = { 87: 'N', 38: 'N', 65: 'W', 37: 'W', 83: 'S', 40: 'S', 68: 'E', 39: 'E'}

  this.keyDown = function(e){
    var direction = directionMap[e.which];
    this.moveQueue.unshift(direction);
    if(socket) {
      socket.emit('move', {direction: direction});
    }
  };

  if(viewport) {
    viewport.onkeydown = this.keyDown.bind(this);
  }
}

module.exports = KeyboardControllable
