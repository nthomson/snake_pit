var Renderable = require('./mixins/renderable');

var Snake = function(base) {
  this.x = base.x || 0;
  this.y = base.y || 0;
  this.radius = 5
  this.sections = [{x: (base.x || 0), y: (base.y || 0)}]
};

Snake.prototype.collide = function(collidedWith) {
  //Handle what happens when player collides with <collidedWith>
}

Snake.prototype.update = function(dt) {
  // this.handle_movement(dt);
  headPos = {
    x: this.sections[0].x,
    y: this.sections[0].y
  }

  this.lastKey = this.moveQueue.pop() || this.lastKey

  yMult = this.lastKey == 'N' ? -1 : 0;
  yMult = this.lastKey == 'S' ?  1 : yMult;
  xMult = this.lastKey == 'E' ?  1 : 0;
  xMult = this.lastKey == 'W' ? -1 : xMult;

  headPos.x += (this.radius * 2 * xMult)
  headPos.y += (this.radius * 2 * yMult)

  // console.log(this.sections)

  var tail = headPos
  // tail.x = headPos.x
  // tail.y = headPos.y
  this.sections.unshift(tail)
}

Snake.prototype.draw = function(context) {
  // For each cell, draw a ?square?
  this.sections.forEach(function(section){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
  })
}

// Renderable.call(Snake.prototype)

module.exports = Snake
