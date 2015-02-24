var Controllable = function() {
  this.moveQueue = [];
  this.directionMap = { 87: 'N', 38: 'N', 65: 'W', 37: 'W', 83: 'S', 40: 'S', 68: 'E', 39: 'E'}
  this.lastKey = 'W'

  this.keyDown = function(e){
    this.moveQueue.unshift(this.directionMap[e.which]);
  };

  if(window) {
    window.onkeydown = this.keyDown.bind(this);
  }
};

module.exports = Controllable
