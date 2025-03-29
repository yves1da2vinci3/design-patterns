class VehicleFactory {
    createVehicle(type, make, model) {
      switch (type) {
        case 'car':
          return new Car(make, model);
        case 'motorcycle':
          return new Motorcycle(make, model);
        default:
          throw new Error('Invalid vehicle type');
      }
    }
  }
  
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
  const vehicleFactory = new VehicleFactory();
  
  const car = vehicleFactory.createVehicle('car', 'Toyota', 'Corolla');
  car.drive(); // Output: Driving Toyota Corolla
  
  const motorcycle = vehicleFactory.createVehicle('motorcycle', 'Honda', 'CBR500R');
  motorcycle.drive(); // Output: Riding Honda CBR500R
  