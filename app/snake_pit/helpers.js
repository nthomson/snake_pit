define(function(){
  return {
    draw_x: function(x, y, width, height) {
      return x;
    },
    draw_y: function(x, y, width, height) {
      return y - height;
    },
    update_with_dt: function(object){
      object.update(this);
    },
    filter_active: function(object) {
      return object.active
    },
    collides: function(a, b) {
      var dx = a.x - b.x
      var dy = a.y - b.y
      var distance = Math.sqrt(dx * dx + dy * dy);

      return (distance < a.radius + b.radius);
    },
    check_collide: function(first, second) {
      if(this.collides(first, second)){
        first.collide(second);
        second.collide(first);
      }
    },
    draw_with_context: function(object){
      object.draw(this);
    },
  };
})
