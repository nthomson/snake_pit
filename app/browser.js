// Browser-Side!
var SnakePit = require('./snake_pit');

var Game = SnakePit.Game

var game = new Game({
  viewport: viewport,
  game_width: 800,
  game_height: 480
});

// Snake acts as controllable
SnakePit.Controllable.call(game.snake)

game.run()
