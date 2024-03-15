class ShapeFactory {
    createShape(type, ...args) {
      switch (type) {
        case 'circle':
          return new Circle(...args);
        case 'rectangle':
          return new Rectangle(...args);
        default:
          throw new Error('Invalid shape type');
      }
    }
  }
  
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
  const shapeFactory = new ShapeFactory();
  
  const circle = shapeFactory.createShape('circle', 5);
  console.log(circle.area()); // Output: 78.53981633974483
  
  const rectangle = shapeFactory.createShape('rectangle', 4, 6);
  console.log(rectangle.area()); // Output: 24
  