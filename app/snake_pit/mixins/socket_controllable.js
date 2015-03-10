var Controllable = require('./controllable');

var SocketControllable = function(socket) {
  // Mixin controllable
  Controllable.call(this);
  this.socketId = Math.random().toString(36).substring(2, 8);

  socket.on('move', function(e){
    this.moveQueue.unshift(e.direction);

    // Rebroadcast movement to everyone else
    socket.broadcast.emit('move', {direction: e.direction, id: this.id});
  }.bind(this));
};

module.exports = SocketControllable
