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
  player_count: 2,
  step: 0.1
};

function newGame(players) {
  console.log('New game with:', players.map(function(p){ return p.name;}).join(', '));

  game = new Game(gameConfig, players);
  game.isServer = true;
  game.io = io;
  game.onFinish(checkNewGame);

  game.onSync(function(){
    io.emit('game_sync', game.getState());
  })

  players.forEach(function(player, index){
    var snake = game.snakes[index],
        socket = sockets[player.id];

    SnakePit.SocketControllable.call(snake, socket, true);

    socket.on('disconnect', function(){
      // A player disconnected while he was in the game, kill his snake
      snake.explode();
    })
  });

  game.start();

  var gameEmit = {game: game.getState(), players: players};
  console.log(gameEmit);
  io.emit('game_start', gameEmit);
}

function checkNewGame() {
  if(playerPool.length >= gameConfig.player_count) {
    // Start a new game with the first <player_count> players in playerPool and remove them from the pool
    newGame(playerPool.splice(0, gameConfig.player_count));
    io.emit('pool', playerPool);
  }
}

io.sockets.on('connection', function(socket){
  console.log('New connection')

  // Get the latest pool on connection.
  io.emit('pool', playerPool);

  var player;

  socket.on('join_pool', function(data){
    player = {
      name: data.name,
      id: Math.random().toString(36).substring(2, 8),
    };

    socket.emit('id', player.id)

    sockets[player.id] = socket;
    playerPool.push(player);

    console.log('New player in pool', player)

    // Update everyone on the new pool state
    io.emit('pool', playerPool);

    checkNewGame();
  });

  socket.on('disconnect', function(){
    var index = playerPool.indexOf(player);

    if(index >= 0){
      // Remove this player from the pool
      playerPool.splice(index, 1);
      io.emit('pool', playerPool);
    }
  })
});
