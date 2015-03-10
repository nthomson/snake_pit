var Snake = function(base) {
  var colors = ['#08c', '#8c0', '#c80', '#88c', '#c08'];
  this.size = base.size || 30;
  this.color = base.color || colors[Math.floor(Math.random()*colors.length)];
  this.sections = [{x: base.x, y: base.y}]
  this.id = base.id;
  this.name = base.name;
  this.head = this.sections[0]
};

Snake.prototype = {
  _death: function(){},
  _eat: function(){},

  eat: function() {
    this.ateSomething = true;
    this._eat();
  },

  explode: function() {
    this.dead = true
    this._death();
  },

  update: function() {
    if(this.dead) {
      // Unwind the snake after death
      this.sections.pop()
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
  },

  toJSON: function() {
    return {
      id: this.id,
      sections: this.sections,
      lastDirection: this.lastDirection,
      color: this.color
    }
  },

  on: function(e, callback) {
    this['_'+e] = callback;
  },

  draw: function(context) {
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
  },
}



module.exports = Snake
