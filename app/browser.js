// Browser-Side!
var SnakePit = require('./snake_pit'),
    Game = SnakePit.Game;


angular.module('snakePitApp', [])
.controller('gameCtrl', [
  '$scope',
  function($scope){
    $scope.queue = [];
    $scope.playerId = '';
    var socket = io.connect('http://localhost:3000/');

    socket.on('id', function(id){
      $scope.playerId = id;
    });

    socket.on('pool', function(data){
      $scope.queue = data;
      $scope.$digest();
    });



    socket.on('game_start', function(data){
      data.game.config.viewport = viewport;
      var game = Game.fromState(data);

      socket.on('game_sync', function(data){
        game.sync(data);
      })

      socket.on('food', function(food){
        game.food.x = food.x;
        game.food.y = food.y;
      })

      data.players.forEach(function(player, index){
        var snake = game.snakes[index];

        if(snake.player == $scope.playerId) {
          // Keyboard controllable
          SnakePit.KeyboardControllable.call(snake, viewport, socket);
        }
        else {
          // socket controllable
          SnakePit.SocketControllable.call(snake, socket, true);
        }

        socket.on('disconnect', function(){
          // A player disconnected while he was in the game, kill his snake
          snake.explode();
        })
      });

      game.start();
    })

    $scope.joinQueue = function(){
      var player = {name: $scope.playerName};
      // $scope.queue.push(player);
      $scope.inQueue = true;
      socket.emit('join_pool', player);
    }
  }
])
