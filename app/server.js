var SnakePit = require('./snake_pit'),
    io = require('socket.io')(3000);

var Game = SnakePit.Game


io.sockets.on('connection', function(socket){
  // Retrieve or create the game
  var game = new Game({
    viewport: null,
    game_width: 240,
    game_height: 240,
    step: 0.1
  });

  // Snake acts as controllable
  SnakePit.SocketControllable.call(game.snake, socket, true)

  game.run()
});
