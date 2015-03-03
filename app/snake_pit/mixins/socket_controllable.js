var Controllable = require('./controllable');

var SocketControllable = function(socket, emit) {
  // Mixin controllable
  Controllable.call(this);

  socket.on('move', function(e){
    this.moveQueue.unshift(e.direction);
    if(emit){
      socket.emit('move', {direction: e.direction});
    }
  }.bind(this));
};

module.exports = SocketControllable
