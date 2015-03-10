var SnakePit = require('./snake_pit'),
    Game = SnakePit.Game,
    Pool = require('./server/pool'),
    io = require('socket.io')(3000),
    sockets = {};


var game = new Game({
  game_width: 480,
  game_height: 480,
  max_players: 2,
  io: io,
  isServer: true
});

game.start();

var pool = new Pool();

io.sockets.on('connection', function(socket){
  var player = { id: Math.random().toString(36).substring(2, 8) };
  sockets[player.id] = socket;

  // Send the latest pool of players to the new connection.
  socket.emit('pool', pool.queue);

  socket.emit('game_start', game.toJSON())

  pool.on('update', function(){
    // While there are players in the queue and room in the game
    while(pool.queue.length && game.snakes.length < game.config.max_players) {

      var newPlayer = pool.queue.shift(),
          snake = game.addPlayer(newPlayer);
      io.emit('add_player', {player: newPlayer, placement: {x: snake.head.x, y: snake.head.y}})

      sockets[newPlayer.id].removeAllListeners('move');
      SnakePit.SocketControllable.call(snake, sockets[newPlayer.id]);
      snake.on('sync', function(){
        io.emit('game_sync', game.toJSON());
      });

      snake.on('death', function(){
        // pool.removePlayer(player, socket)
        game.snakes = game.snakes.filter(function(s){ return s.id != snake.id }); // Remove the snake from the game
        io.emit('remove_player', {id: snake.id})
        pool.addPlayer(newPlayer, sockets[newPlayer.id]);
      })
    }

    io.emit('pool', pool.queue)
  })

  socket.on('join_pool', pool.addPlayer.bind(pool, player, socket));
  socket.on('disconnect', pool.removePlayer.bind(pool, player, socket))
});
