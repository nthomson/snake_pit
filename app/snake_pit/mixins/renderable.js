var Renderable = function() {
  this.draw = function(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
  };
};

module.exports = Renderable
