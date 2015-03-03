var Controllable = function() {
  this.lastDirection = ''
  this.moveQueue = [];

  var opposites = {N: 'S', S: 'N', E: 'W', W: 'E'};

  this.xMultiplier = function() {
    xMult = this.lastDirection == 'E' ?  1 : 0;
    xMult = this.lastDirection == 'W' ? -1 : xMult;
    return xMult;
  }

  this.yMultiplier = function() {
    yMult = this.lastDirection == 'N' ? -1 : 0;
    yMult = this.lastDirection == 'S' ?  1 : yMult;
    return yMult;
  }

  this.handle_movement = function(obj) {
    var newMove = this.moveQueue.pop();
    if(opposites[newMove] != this.lastDirection) {
      this.lastDirection = newMove || this.lastDirection
    }

    var newX = obj.x + (this.size * this.xMultiplier())
    var newY = obj.y + (this.size * this.yMultiplier())

    return {x: newX, y: newY}
  }
};

module.exports = Controllable
