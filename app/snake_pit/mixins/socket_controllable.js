var Controllable = require('./controllable');

var SocketControllable = function() {
  // Mixin controllable
  Controllable.call(this)
};

module.exports = SocketControllable
