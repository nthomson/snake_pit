var Food = function() {
  this.size = 30;
  this.color = '#fff'
};

Food.prototype.placeFood = function(placement) {
  // Randomly generate placement from within list of free squares
  this.x = placement.x;
  this.y = placement.y;
}

Food.prototype.draw = function(context) {
  context.fillStyle = this.color;
  context.fillRect(this.x,this.y, this.size, this.size);
}

module.exports = Food
