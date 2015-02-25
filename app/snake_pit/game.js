var Snake   = require('./snake'),
    Food    = require('./food'),
    helpers = require('./helpers');

var Game = function(config) {
  this.config = config;
  this.context = this.config.viewport.getContext('2d')
  this.dt = 0;

  this.squares = [];
  for(var x = 0; x < config.game_width; x+=15) {
    for(var y = 0; y < config.game_height; y+=15) {
      this.squares.push({x: x, y: y})
    }
  }

  this.snake = new Snake({x: 0, y: 0})
  this.food = new Food(this.freeSquares())
};

// Main game loop
var start, last = new Date().getTime();
Game.prototype.run = function(){
  start = new Date().getTime();
  this.handleCollisions();
  this.update((start - last) / 1000.0);
  this.draw(this.context);
  last = start;
  setTimeout(this.run.bind(this), 1);
};

Game.prototype.update = function(idt) {
  this.dt += idt;

  // Its been long enough to update.
  if(this.dt >= this.config.step) {
    this.dt = 0;
    this.snake.update();
  }
};

Game.prototype.draw = function(context) {
  //Clear the canvas
  context.clearRect(0, 0, this.config.game_width, this.config.game_height);

  //Draw all of the game's objects
  this.snake.draw(context);
  this.food.draw(context);
};

var collides = function(a, b) {
  return a.x === b.x && a.y === b.y;
}

Game.prototype.handleCollisions = function() {
  if(collides(this.snake.sections[0], this.food)) {
    this.snake.eat();
    this.food.placeFood(this.freeSquares());
  }

  // if(this.snake.collidesWith(this.food)){
  //   this.snake.eat();
  //   this.food.placeFood(this.freeSquares());
  // }
}

Game.prototype.freeSquares = function() {
  var occupiedSquares = this.snake.sections.map(function(s){ return s.x+','+s.y; });

  return this.squares.filter(function(square){
    return occupiedSquares.indexOf(square.x +','+square.y) < 0 // True if current square is unoccupied
  });
}

module.exports = Game
