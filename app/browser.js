// Browser-Side!
var SnakePit = require('./snake_pit'),
    Game = SnakePit.Game;

var socket = io.connect('http://kanicweb.com:3000/');

var game = new Game({
  viewport: viewport,
  game_width: 240,
  game_height: 240,
  step: 0.1
});

var game2 = new Game({
  viewport: mirror,
  game_width: 240,
  game_height: 240,
  step: 0.1
});


// Snake acts as controllable
SnakePit.KeyboardControllable.call(game.snake, socket)
SnakePit.SocketControllable.call(game2.snake, socket)


game.run()
game2.run(true)



// Server
//   Snakes: Socket controllable, Socket emittable
//
//
// Browser
//   Player: Keyboard controllable, Socket emittable
//   Snakes: Socket controllable
