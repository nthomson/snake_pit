var Snake  = require('./snake'),
    helpers = require('./helpers');

var Game = function(config) {
  this.viewport = config.viewport;
  this.context = this.viewport.getContext('2d')
  this.game_width = config.game_width;
  this.game_height = config.game_height;

  this.test_rad = 20;

  this.snake = new Snake({x: 400, y: 240})
};

// Main game loop
Game.prototype.run = function(){
  this.update();
  this.draw(this.context);

  // start the main loop
  requestAnimationFrame( this.run.bind(this), this.viewport);
};

Game.prototype.update = function() {
  // Calculate time since last frame (delta time)
  var thisFrame = new Date().getTime();
  var dt = (thisFrame - this.lastFrame)/1000;
  if(!dt){dt = 0;} // Handle NaN
  this.lastFrame = thisFrame;

  this.handle_collisions();

  this.snake.update(dt);
};

Game.prototype.draw = function(context) {
  //Clear the canvas
  context.clearRect(0, 0, this.game_width, this.game_height);

  //Draw all of the game's objects
  this.snake.draw(context);
};

Game.prototype.handle_collisions = function() {}

module.exports = Game
