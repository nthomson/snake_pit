var Controllable = require('./controllable');

var SocketControllable = function(socket, emit) {
  // Mixin controllable
  Controllable.call(this);

  console.log('Socket Controllable')

  socket.on('move', function(e){
    console.log('move', e.direction);
    this.moveQueue.unshift(e.direction);
    if(emit){
      socket.broadcast.emit('move', {direction: e.direction});
    }
  }.bind(this));
};

module.exports = SocketControllable
