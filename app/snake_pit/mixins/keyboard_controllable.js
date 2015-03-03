var Controllable = require('./controllable');

var KeyboardControllable = function() {

  // Mixin controllable
  Controllable.call(this)


  var directionMap = { 87: 'N', 38: 'N', 65: 'W', 37: 'W', 83: 'S', 40: 'S', 68: 'E', 39: 'E'}

  this.keyDown = function(e){
    this.moveQueue.unshift(directionMap[e.which]);
  };

  if(window) {
    window.onkeydown = this.keyDown.bind(this);
  }
};



module.exports = KeyboardControllable
