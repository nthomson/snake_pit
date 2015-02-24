var Snake  = require('./snake'),
    helpers = require('./helpers');

var Game = function(config) {
  this.viewport = config.viewport;
  this.context = this.viewport.getContext('2d')
  this.game_width = config.game_width;
  this.game_height = config.game_height;
  this.fps = config.fps;

  this.snake = new Snake({x: 400, y: 240})
};

// Main game loop
Game.prototype.run = function(){
  this.update();
  this.draw(this.context);
  setTimeout(this.run.bind(this), 1000 / this.fps);
};

Game.prototype.update = function() {
  // Calculate time since last frame (delta time)
  var thisFrame = new Date().getTime();
  var dt = (thisFrame - this.lastFrame)/1000;
  if(!dt){dt = 0;} // Handle NaN
  this.lastFrame = thisFrame;

  this.snake.update(dt);
};

Game.prototype.draw = function(context) {
  //Clear the canvas
  context.clearRect(0, 0, this.game_width, this.game_height);

  //Draw all of the game's objects
  this.snake.draw(context);
};

module.exports = Game
