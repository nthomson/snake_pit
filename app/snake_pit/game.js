var Snake   = require('./snake'),
    Food    = require('./food');

var Game = function(config) {
  this.config = config;
  this.context = config.viewport ? this.config.viewport.getContext('2d') : null;
  this.dt = 0;
  this.io = config.io;
  this.isServer = config.isServer;

  this.squares = [];
  for(var x = 0; x < config.game_width; x+=30) {
    for(var y = 0; y < config.game_height; y+=30) {
      this.squares.push({x: x, y: y})
    }
  }

  this.snakes = [];
  this.food = new Food()
  this.food.placeFood(this.freeSquare());
};

Game.prototype.snakeById = function(id) {
  return this.snakes.filter(function(s){ return s.id == e.id })[0];
}

Game.prototype.addPlayer = function(player, placement){
  var placement = placement || this.freeSquare(),
      snake = new Snake({x: placement.x, y: placement.y, id: player.id, color: player.color});
  this.snakes.push(snake);

  return snake;
}

Game.prototype.start = function(){
  this.run();
}

// Main game loop
var start, last = new Date().getTime();
Game.prototype.run = function(){
  if(this.shouldSync){
    this.io.emit('game_sync', this.toJSON())
    this.shouldSync = false;
  }
  start = new Date().getTime();
  this.handleCollisions();
  this.update((start - last) / 1000.0);
  if(this.context){ this.draw(this.context); }
  last = start;
  setTimeout(this.run.bind(this), 100);
};

Game.prototype.update = function(idt) {
  this.snakes.forEach(function(snake){ snake.update(); });
  if(this.syncCallback){
    this.syncCallback();
  }
};


Game.prototype.toJSON = function(){
  return {
    snakes: this.snakes.map(function(snake){ return snake.toJSON(); }),
    food: this.food,
    config: {
      game_width: this.config.game_width,
      game_height: this.config.game_height
    }
  }
}

Game.fromState = function(state){
  var game = new Game(state.config);

  game.food.x = state.food.x;
  game.food.y = state.food.y;

  return game;
}

Game.prototype.sync = function(game) {
  this.food.x = game.food.x;
  this.food.y = game.food.y;

  this.snakes.forEach(function(snake, index){
    snake.sections = game.snakes[index].sections
    snake.lastDirection = game.snakes[index].lastDirection
    snake.head = snake.sections[0];
  })
}

Game.prototype.draw = function(context) {
  //Clear the canvas
  context.clearRect(0, 0, this.config.game_width, this.config.game_height);

  //Draw all of the game's objects
  this.snakes.forEach(function(snake){ snake.draw(context); });
  this.food.draw(context);
};

var collides = function(a, b) {
  return a.x === b.x && a.y === b.y;
}

Game.prototype.handleCollisions = function() {
  this.snakes.forEach(function(snake){
    if(!snake.dead) {
      // Snake collides with food
      if(collides(snake.head, this.food)) {
        snake.eat();

        if(this.isServer) {
          this.food.placeFood(this.freeSquare());
          this.shouldSync = true;
        }
        else {
          this.food.x = undefined;
          this.food.y = undefined;
        }
      }

      // Snake collides with itself
      if(snake.sections.filter(collides.bind(null, snake.head)).length > 1){
        snake.explode();
      }

      // Snake collides with wall
      if(this.outOfMap(snake.head)){
        snake.explode();
      }
    }
  }.bind(this))
}

Game.prototype.outOfMap = function(obj) {
  return obj.x < 0 || obj.y < 0 || obj.y >= this.config.game_height || obj.x >= this.config.game_width;
}

Game.prototype.freeSquares = function() {
  var occupiedSquares = [];
  if(this.snakes.length) {
    occupiedSquares = this.snakes
      .map(function(snake){ return snake.sections })
      .reduce(function(a, b) { return a.concat(b); })
      .map(function(sec){ return sec.x + ',' + sec.y; })
  }

  return this.squares.filter(function(square){
    return occupiedSquares.indexOf(square.x +','+square.y) < 0 // True if current square is unoccupied
  });
}

Game.prototype.freeSquare = function() {
  var freeSquares = this.freeSquares()
  return freeSquares[Math.floor(Math.random()*freeSquares.length)];
}

module.exports = Game
