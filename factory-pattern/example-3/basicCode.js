class Car {
    constructor(make, model) {
      this.make = make;
      this.model = model;
    }
  
    drive() {
      console.log(`Driving ${this.make} ${this.model}`);
    }
  }
  
  class Motorcycle {
    constructor(make, model) {
      this.make = make;
      this.model = model;
    }
  
    drive() {
      console.log(`Riding ${this.make} ${this.model}`);
    }
  }
  
  // Usage
  const car = new Car('Toyota', 'Corolla');
  car.drive(); // Output: Driving Toyota Corolla
  
  const motorcycle = new Motorcycle('Honda', 'CBR500R');
  motorcycle.drive(); // Output: Riding Honda CBR500R
  