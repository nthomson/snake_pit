var Snake  = require('./snake'),
    helpers = require('./helpers');

var Game = function(config) {
  this.config = config;
  this.context = this.config.viewport.getContext('2d')
  this.dt = 0;

  this.snake = new Snake({x: 400, y: 240})
};

// Main game loop
var start, last = new Date().getTime();
Game.prototype.run = function(){
  start = new Date().getTime();
  this.update((start - last) / 1000.0);
  this.draw(this.context);
  last = start;
  setTimeout(this.run.bind(this), 1);
};

Game.prototype.update = function(idt) {
  this.dt += idt;

  // Its been long enough to update.
  if(this.dt > this.config.step) {
    this.dt -= this.config.step;
    this.snake.update();
  }
};

Game.prototype.draw = function(context) {
  //Clear the canvas
  context.clearRect(0, 0, this.config.game_width, this.config.game_height);

  //Draw all of the game's objects
  this.snake.draw(context);
};

module.exports = Game
