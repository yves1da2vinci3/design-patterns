class Circle {
    constructor(radius) {
      this.radius = radius;
    }
  
    area() {
      return Math.PI * this.radius ** 2;
    }
  }
  
  class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  
    area() {
      return this.width * this.height;
    }
  }
  
  // Usage
  const circle = new Circle(5);
  console.log(circle.area()); // Output: 78.53981633974483
  
  const rectangle = new Rectangle(4, 6);
  console.log(rectangle.area()); // Output: 24
  