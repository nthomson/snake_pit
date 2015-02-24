var Snake = function(base) {
  this.x = base.x || 0;
  this.y = base.y || 0;
  this.size = base.size || 15;
  this.sections = [{x: 0, y: 0}]
};

Snake.prototype.collide = function(collidedWith) {
  //Handle what happens when player collides with <collidedWith>
}

Snake.prototype.update = function() {
  this.ateSomething = Math.random() > 0.95;
  var head = this.sections[0]

  this.lastKey = this.moveQueue.pop() || this.lastKey

  yMult = this.lastKey == 'N' ? -1 : 0;
  yMult = this.lastKey == 'S' ?  1 : yMult;
  xMult = this.lastKey == 'E' ?  1 : 0;
  xMult = this.lastKey == 'W' ? -1 : xMult;

  var newX = head.x + (this.size * xMult)
  var newY = head.y + (this.size * yMult)

  var tail = this.ateSomething ? {x: 0, y: 0} : this.sections.pop()

  tail.x = newX;
  tail.y = newY;

  this.sections.unshift(tail)
}

Snake.prototype.draw = function(context) {
  // For each cell, draw a ?square?
  this.sections.forEach(function(section){
    context.fillRect(section.x + 1,section.y + 1, this.size-2, this.size-2);
  }.bind(this))
}

module.exports = Snake
