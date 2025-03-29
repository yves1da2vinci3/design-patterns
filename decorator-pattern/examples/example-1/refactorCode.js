// Implémentation avec le Decorator Pattern

// Composant de base
class Coffee {
  getCost() {
    return 5; // Prix de base du café
  }

  getDescription() {
    return 'Café simple';
  }
}

// Décorateur de base
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  getCost() {
    return this.coffee.getCost();
  }

  getDescription() {
    return this.coffee.getDescription();
  }
}

// Décorateurs concrets
class MilkDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getCost() {
    return this.coffee.getCost() + 1; // Ajoute 1€ pour le lait
  }

  getDescription() {
    return this.coffee.getDescription() + ', avec du lait';
  }
}

class SugarDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getCost() {
    return this.coffee.getCost() + 0.5; // Ajoute 0.5€ pour le sucre
  }

  getDescription() {
    return this.coffee.getDescription() + ', avec du sucre';
  }
}

class CinnamonDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getCost() {
    return this.coffee.getCost() + 0.75; // Ajoute 0.75€ pour la cannelle
  }

  getDescription() {
    return this.coffee.getDescription() + ', avec de la cannelle';
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getCost() {
    return this.coffee.getCost() + 1.5; // Ajoute 1.5€ pour la crème fouettée
  }

  getDescription() {
    return this.coffee.getDescription() + ', avec de la crème fouettée';
  }
}

// Utilisation
let coffee = new Coffee();
console.log(`${coffee.getDescription()} coûte ${coffee.getCost()}€`);

// Ajouter du lait
coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} coûte ${coffee.getCost()}€`);

// Ajouter du sucre
coffee = new SugarDecorator(coffee);
console.log(`${coffee.getDescription()} coûte ${coffee.getCost()}€`);

// Créer un café différent avec une combinaison différente
let specialCoffee = new Coffee();
specialCoffee = new CinnamonDecorator(specialCoffee);
specialCoffee = new WhippedCreamDecorator(specialCoffee);
console.log(
  `${specialCoffee.getDescription()} coûte ${specialCoffee.getCost()}€`
);

// On peut même combiner de manière plus créative
let superSpecialCoffee = new WhippedCreamDecorator(
  new CinnamonDecorator(new SugarDecorator(new MilkDecorator(new Coffee())))
);
console.log(
  `${superSpecialCoffee.getDescription()} coûte ${superSpecialCoffee.getCost()}€`
);
