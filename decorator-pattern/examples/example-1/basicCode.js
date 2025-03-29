// Implémentation sans le Decorator Pattern
class Coffee {
  getCost() {
    return 5; // Prix de base du café
  }

  getDescription() {
    return 'Café simple';
  }
}

class CoffeeWithMilk extends Coffee {
  getCost() {
    return super.getCost() + 1; // Ajoute 1€ pour le lait
  }

  getDescription() {
    return super.getDescription() + ', avec du lait';
  }
}

class CoffeeWithSugar extends Coffee {
  getCost() {
    return super.getCost() + 0.5; // Ajoute 0.5€ pour le sucre
  }

  getDescription() {
    return super.getDescription() + ', avec du sucre';
  }
}

class CoffeeWithMilkAndSugar extends CoffeeWithMilk {
  getCost() {
    return super.getCost() + 0.5; // Ajoute 0.5€ pour le sucre
  }

  getDescription() {
    return 'Café simple, avec du lait, avec du sucre';
  }
}

// Utilisation
const simpleCoffee = new Coffee();
console.log(
  `${simpleCoffee.getDescription()} coûte ${simpleCoffee.getCost()}€`
);

const coffeeWithMilk = new CoffeeWithMilk();
console.log(
  `${coffeeWithMilk.getDescription()} coûte ${coffeeWithMilk.getCost()}€`
);

const coffeeWithMilkAndSugar = new CoffeeWithMilkAndSugar();
console.log(
  `${coffeeWithMilkAndSugar.getDescription()} coûte ${coffeeWithMilkAndSugar.getCost()}€`
);

// Problème: si on veut ajouter d'autres combinaisons, on aurait besoin de créer encore plus de classes
// Par exemple: CoffeeWithSugarAndCinnamon, CoffeeWithMilkAndCinnamonAndSugar, etc.
// Et si on ajoute un nouvel ingrédient, le nombre de classes augmente exponentiellement.
