var Snake = function(base) {
  this.x = base.x || 0;
  this.y = base.y || 0;
  this.radius = 5
  this.sections = [{x: 100, y: 50}]
};

Snake.prototype.collide = function(collidedWith) {
  //Handle what happens when player collides with <collidedWith>
}

Snake.prototype.update = function(dt) {  
  var head = this.sections[0]

  this.lastKey = this.moveQueue.pop() || this.lastKey

  yMult = this.lastKey == 'N' ? -1 : 0;
  yMult = this.lastKey == 'S' ?  1 : yMult;
  xMult = this.lastKey == 'E' ?  1 : 0;
  xMult = this.lastKey == 'W' ? -1 : xMult;

  var newX = head.x + (this.radius * 2 * xMult)
  var newY = head.y + (this.radius * 2 * yMult)

  var tail = this.ateSomething ? {x: 0, y: 0} : this.sections.pop()

  tail.x = newX;
  tail.y = newY;

  this.sections.unshift(tail)
}

Snake.prototype.draw = function(context) {
  // For each cell, draw a ?square?
  this.sections.forEach(function(section){
    context.beginPath();
    context.arc(section.x, section.y, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
  })
}

module.exports = Snake
