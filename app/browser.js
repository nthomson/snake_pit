// Browser-Side!
var SnakePit = require('./snake_pit');

var Game = SnakePit.Game

var game = new Game({
  viewport: viewport,
  game_width: 240,
  game_height: 240,
  step: 0.1
});

// Snake acts as controllable
SnakePit.KeyboardControllable.call(game.snake)

game.run()
