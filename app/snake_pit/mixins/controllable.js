var Controllable = function() {
  this.moveQueue = [];
  this.directionMap = { 87: 'N', 38: 'N', 65: 'W', 37: 'W', 83: 'S', 40: 'S', 68: 'E', 39: 'E'}
  this.lastKey = ''

  var opposites = {N: 'S', S: 'N', E: 'W', W: 'E'}
  this.keyDown = function(e){
    var newKey = this.directionMap[e.which];
    if(opposites[newKey] !== this.lastKey)
      this.moveQueue.unshift(newKey);
  };

  this.xMultiplier = function() {
    xMult = this.lastKey == 'E' ?  1 : 0;
    xMult = this.lastKey == 'W' ? -1 : xMult;
    return xMult;
  }

  this.yMultiplier = function() {
    yMult = this.lastKey == 'N' ? -1 : 0;
    yMult = this.lastKey == 'S' ?  1 : yMult;
    return yMult;
  }

  this.handle_movement = function(obj) {
    this.lastKey = this.moveQueue.pop() || this.lastKey

    var newX = obj.x + (this.size * this.xMultiplier())
    var newY = obj.y + (this.size * this.yMultiplier())

    return {x: newX, y: newY}
  }

  if(window) {
    window.onkeydown = this.keyDown.bind(this);
  }
};

module.exports = Controllable
