// Browser-Side!
var SnakePit = require('./snake_pit'),
    Game = SnakePit.Game;


angular.module('snakePitApp', [])
.controller('gameCtrl', [
  '$scope',
  function($scope){
    $scope.queue = [];
    var socket = io.connect('http://localhost:3000/');

    socket.on('pool', function(data){
      $scope.queue = data;
      $scope.$digest();
    });

    socket.on('game_state', function(data){
      var game = new Game({
        viewport: viewport,
        game_width: data.game.config.game_width,
        game_height: data.game.config.game_height,
        step: data.game.config.step
      });
      if(data.ongoing){
        SnakePit.SocketControllable.call(game.snake, viewport, socket); // Snake acts as controllable
      }
      else {
        SnakePit.KeyboardControllable.call(game.snake, viewport, socket); // Snake acts as controllable
      }

      game.run();
    })

    $scope.joinQueue = function(){
      var player = {name: $scope.playerName};
      // $scope.queue.push(player);
      $scope.inQueue = true;
      socket.emit('join_pool', player);
    }
  }
])
