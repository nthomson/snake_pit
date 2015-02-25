Collision
  Snake heads with:
    All snake sections
    Food

On collide:
  Food
    Food.place()
  Snake section
    Nothing
  Snake
    Snake section: snake.explode()
    Food: snake.eat()
    
