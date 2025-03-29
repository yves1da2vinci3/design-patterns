let instance;

// Sans singleton - crée plusieurs instances
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    return ++this.count;
  }

  decrement() {
    return --this.count;
  }
}

// Utilisation sans Singleton
const counter1 = new Counter();
const counter2 = new Counter();

counter1.increment(); // count = 1
counter2.increment(); // count = 1 (séparé)

console.log(counter1 === counter2); // false - instances différentes
