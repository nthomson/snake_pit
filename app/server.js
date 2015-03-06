var SnakePit = require('./snake_pit'),
    io = require('socket.io')(3000),
    Game = SnakePit.Game,
    playerPool = [],
    games = [],
    sockets = {},
    game;

var gameConfig = {
  viewport: null,
  game_width: 480,
  game_height: 480,
  player_count: 1,
  step: 0.1
};

var newGame = function(players) {
  game = new Game(gameConfig);

  players.forEach(function(player, index){
    SnakePit.SocketControllable.call(game.snakes[index], sockets[player.id], true);
  });

  game.run();
  io.emit('game_state', { game: game, ongoing: false });
}


io.sockets.on('connection', function(socket){
  io.emit('pool', playerPool);


  var player;

  socket.on('join_pool', function(data){
    player = {
      name: data.name,
      id: Math.random().toString(36).substring(2, 8),
    };

    sockets[player.id] = socket;
    playerPool.push(player);

    io.emit('pool', playerPool);

    if(game) {
      io.emit('game_state', { game: game, ongoing: true });
    }
    else if(playerPool.length >= gameConfig.player_count) {
      // Start a new game with the first <player_count> players in playerPool and remove them from the pool
      newGame(playerPool.splice(0, gameConfig.player_count));
    }
  });



  socket.on('disconnect', function(){
    // Remove this player from the queue
    playerPool.splice(playerPool.indexOf(player), 1);
    io.emit('pool', playerPool);
  })
});
