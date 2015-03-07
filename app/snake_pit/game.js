var Snake   = require('./snake'),
    Food    = require('./food');

var Game = function(config, players) {
  this.config = config;
  this.context = config.viewport ? this.config.viewport.getContext('2d') : null;
  this.dt = 0;

  this.squares = [];
  for(var x = 0; x < config.game_width; x+=30) {
    for(var y = 0; y < config.game_height; y+=30) {
      this.squares.push({x: x, y: y})
    }
  }

  this.snakes = players.map(function(player){
    return new Snake({x: 0, y: 0, id: player.id});
  });

  this.food = new Food()
  this.food.placeFood(this.freeSquares());
};

Game.prototype.start = function(){
  this.running = true;
  this.run();
}

Game.prototype.onFinish = function(callback) {
  this.finishCallback = callback;
}

Game.prototype.onSync = function(callback) {
  this.syncCallback = callback;
}

// Main game loop
var start, last = new Date().getTime();
Game.prototype.run = function(){
  start = new Date().getTime();
  this.handleCollisions();
  this.update((start - last) / 1000.0);
  if(this.context){ this.draw(this.context); }
  last = start;
  setTimeout(this.run.bind(this), 1);
};

Game.prototype.update = function(idt) {
  this.dt += idt;

  // Its been long enough to update.
  if(this.dt >= this.config.step) {
    this.dt = 0;
    this.snakes.forEach(function(snake){ snake.update(); });
    if(this.syncCallback)
      this.syncCallback();
  }
};


Game.prototype.getState = function(){
  return {
    snakes: this.snakes.map(function(snake){ return snake.getState(); }),
    food: this.food,
    config: this.config
  }
}

Game.fromState = function(state){
  var game = new Game(state.game.config, state.players);

  game.food.x = state.game.food.x;
  game.food.y = state.game.food.y;

  game.snakes.forEach(function(snake, index){ snake.sections = state.game.snakes[index].sections })

  return game;
}

Game.prototype.sync = function(game) {
  this.food.x = game.food.x;
  this.food.y = game.food.y;

  this.snakes.forEach(function(snake, index){ snake.sections = game.snakes[index].sections })
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
        console.log('Eat');

        if(this.isServer) {
          this.food.placeFood(this.freeSquares());
          this.io.emit('food', this.food);
          console.log(this.food);
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
  var occupiedSquares = this.snakes
    .map(function(snake){ return snake.sections })
    .reduce(function(a, b) { return a.concat(b); })
    .map(function(sec){ return sec.x + ',' + sec.y; })

  return this.squares.filter(function(square){
    return occupiedSquares.indexOf(square.x +','+square.y) < 0 // True if current square is unoccupied
  });
}

module.exports = Game
