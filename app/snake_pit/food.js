var Food = function(freeSquares) {
  this.size = 15;
  this.color = '#fff'

  this.placeFood(freeSquares);
};

Food.prototype.placeFood = function(freeSquares) {
  // Randomly generate placement from within list of free squares
  var placement = freeSquares[Math.floor(Math.random()*freeSquares.length)];

  this.x = placement.x;
  this.y = placement.y;
}

Food.prototype.draw = function(context) {
  // For each cell, draw a ?square?
  context.fillStyle = this.color;
  context.fillRect(this.x,this.y, this.size, this.size);
}

module.exports = Food
