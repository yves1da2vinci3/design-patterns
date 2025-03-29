// Implémentation du Singleton Pattern
class Counter {
  constructor() {
    if (instance) {
      throw new Error('Une seule instance peut être créée!');
    }
    this.count = 0;
    instance = this;
  }

  getInstance() {
    return this;
  }

  increment() {
    return ++this.count;
  }

  decrement() {
    return --this.count;
  }
}

// Autre façon d'implémenter le Singleton Pattern
const SingletonCounter = (function () {
  let instance;

  function createInstance() {
    return new Counter();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Utilisation
const counterA = SingletonCounter.getInstance();
const counterB = SingletonCounter.getInstance();

counterA.increment(); // count = 1
counterB.increment(); // count = 2 (même instance)

console.log(counterA === counterB); // true - même instance
