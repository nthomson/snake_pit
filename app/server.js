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
  console.log('name game');
  game = new Game(gameConfig);

  players.forEach(function(player, index){
    SnakePit.SocketControllable.call(game.snakes[index], sockets[player.id], true);
  });

  game.run();
  console.log('broadcast game_state to everyone');
  io.emit('game_state', { game: game, ongoing: false });
}


io.sockets.on('connection', function(socket){
  console.log('connection')
  io.emit('pool', playerPool);

  if(game) {
    socket.emit('game_state', { game: game, ongoing: true });
    console.log('broadcast gaem_state to single');
  }


  var player;

  socket.on('join_pool', function(data){
    console.log('join_pool: ', data.name)
    player = {
      name: data.name,
      id: Math.random().toString(36).substring(2, 8),
    };

    sockets[player.id] = socket;
    playerPool.push(player);

    io.emit('pool', playerPool);


    if(playerPool.length >= gameConfig.player_count) {
      // Start a new game with the first <player_count> players in playerPool and remove them from the pool
      newGame(playerPool.splice(0, gameConfig.player_count));
      io.emit('pool', playerPool);
    }
  });



  socket.on('disconnect', function(){
    // Remove this player from the queue
    playerPool.splice(playerPool.indexOf(player), 1);
    io.emit('pool', playerPool);
  })
});
