var Snake = function(base) {
  this.x = base.x || 0;
  this.y = base.y || 0;
  this.size = base.size || 15;
  this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
  this.sections = [{x: 0, y: 0}]
  this.head = this.sections[0]
};

Snake.prototype.eat = function() {
  this.ateSomething = true;
}

Snake.prototype.explode = function() {
  this.dead = true
}

Snake.prototype.update = function() {
  if(this.dead) {
    // Unwind the snake after death
    // this.sections.pop()
  }
  else {
    var newPos = this.handle_movement(this.head);

    if(this.lastDirection) {
      var tail = this.ateSomething ? {} : this.sections.pop()
      tail.x = newPos.x;
      tail.y = newPos.y;
      this.sections.unshift(tail)
    }
    this.ateSomething = false
  }

  this.head = this.sections[0];
}

Snake.prototype.draw = function(context) {
  // For each cell, draw a ?square?
  context.fillStyle = this.color;

  this.sections.forEach(function(section, index){
    var alpha = 1.0 - (index / this.sections.length)
    alpha = alpha < 0.75 ? 0.75 : alpha;
    context.globalAlpha = alpha
    if(index == 0)
      context.fillRect(section.x,section.y, this.size, this.size);
    else
      context.fillRect(section.x + 1,section.y + 1, this.size-2, this.size-2);
    context.globalAlpha = 1
  }.bind(this))
}

module.exports = Snake
