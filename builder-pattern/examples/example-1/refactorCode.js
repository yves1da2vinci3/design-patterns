// Implémentation avec le Builder Pattern
// Exemple de création d'un objet Pizza avec de nombreux paramètres

// Produit à construire
class Pizza {
  constructor() {
    // Propriétés initialisées dans le builder
    this.taille = '';
    this.pate = '';
    this.sauce = '';
    this.fromage = null;
    this.garnitures = [];
    this.cuisson = 'standard'; // Option supplémentaire facile à ajouter
    this.tempsPreparation = 0;
    this.prix = 0;
  }

  afficherDetails() {
    console.log('----- Pizza -----');
    console.log(`Taille: ${this.taille}`);
    console.log(`Pâte: ${this.pate}`);
    console.log(`Sauce: ${this.sauce}`);
    console.log(`Fromage: ${this.fromage || 'Aucun'}`);
    console.log(`Cuisson: ${this.cuisson}`);
    console.log(`Temps de préparation: ${this.tempsPreparation} minutes`);
    console.log(`Prix: ${this.prix.toFixed(2)}€`);
    console.log('Garnitures:');
    if (this.garnitures.length === 0) {
      console.log('  Aucune');
    } else {
      this.garnitures.forEach((garniture) => {
        console.log(`  - ${garniture}`);
      });
    }
    console.log('-----------------');
  }
}

// Builder: Construit le produit étape par étape
class PizzaBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.pizza = new Pizza();
    return this;
  }

  // Méthodes pour configurer chaque partie du produit
  taille(taille) {
    const taillesValides = ['petite', 'moyenne', 'grande', 'extra-large'];
    if (!taillesValides.includes(taille)) {
      throw new Error(
        `Taille non valide. Valeurs acceptées: ${taillesValides.join(', ')}`
      );
    }
    this.pizza.taille = taille;

    // Ajuster le prix en fonction de la taille
    if (taille === 'petite') this.pizza.prix += 6;
    else if (taille === 'moyenne') this.pizza.prix += 8;
    else if (taille === 'grande') this.pizza.prix += 10;
    else if (taille === 'extra-large') this.pizza.prix += 12;

    return this;
  }

  pate(pate) {
    const patesValides = ['fine', 'classique', 'épaisse', 'à bord farci'];
    if (!patesValides.includes(pate)) {
      throw new Error(
        `Type de pâte non valide. Valeurs acceptées: ${patesValides.join(', ')}`
      );
    }
    this.pizza.pate = pate;

    // La pâte à bord farci coûte plus cher
    if (pate === 'à bord farci') this.pizza.prix += 2;

    return this;
  }

  sauce(sauce) {
    const saucesValides = ['tomate', 'crème fraîche', 'pesto', 'barbecue'];
    if (!saucesValides.includes(sauce)) {
      throw new Error(
        `Type de sauce non valide. Valeurs acceptées: ${saucesValides.join(
          ', '
        )}`
      );
    }
    this.pizza.sauce = sauce;
    return this;
  }

  fromage(fromage) {
    if (fromage) {
      const fromagesValides = [
        'mozzarella',
        'cheddar',
        'emmental',
        'chèvre',
        'gorgonzola',
      ];
      if (!fromagesValides.includes(fromage)) {
        throw new Error(
          `Type de fromage non valide. Valeurs acceptées: ${fromagesValides.join(
            ', '
          )}`
        );
      }
      this.pizza.fromage = fromage;

      // Les fromages spéciaux coûtent plus cher
      if (['chèvre', 'gorgonzola'].includes(fromage)) {
        this.pizza.prix += 1.5;
      } else {
        this.pizza.prix += 1;
      }
    }
    return this;
  }

  ajouterGarniture(garniture) {
    const garnituresValides = [
      'jambon',
      'champignons',
      'poivrons',
      'oignons',
      'olives',
      'ail',
      'basilic',
      'poulet',
      'bacon',
      'œuf',
      'maïs',
      'ananas',
    ];
    if (!garnituresValides.includes(garniture)) {
      throw new Error(
        `Garniture non valide. Valeurs acceptées: ${garnituresValides.join(
          ', '
        )}`
      );
    }

    // Maximum 8 garnitures pour garantir une cuisson correcte
    if (this.pizza.garnitures.length >= 8) {
      throw new Error('Maximum 8 garnitures par pizza');
    }

    this.pizza.garnitures.push(garniture);

    // Chaque garniture ajoute au prix
    this.pizza.prix += 0.75;

    // Plus de garnitures = plus de temps de préparation
    this.pizza.tempsPreparation += 1;

    return this;
  }

  cuisson(type) {
    const cuissonsValides = [
      'légère',
      'standard',
      'bien cuite',
      'croustillante',
    ];
    if (!cuissonsValides.includes(type)) {
      throw new Error(
        `Type de cuisson non valide. Valeurs acceptées: ${cuissonsValides.join(
          ', '
        )}`
      );
    }
    this.pizza.cuisson = type;

    // Ajuster le temps de préparation en fonction du type de cuisson
    if (type === 'légère') this.pizza.tempsPreparation += 12;
    else if (type === 'standard') this.pizza.tempsPreparation += 15;
    else if (type === 'bien cuite') this.pizza.tempsPreparation += 18;
    else if (type === 'croustillante') this.pizza.tempsPreparation += 20;

    return this;
  }

  // Méthode pour construire le produit final
  construire() {
    // Vérifier que la pizza a les éléments minimum requis
    if (!this.pizza.taille)
      throw new Error('La taille de la pizza est obligatoire');
    if (!this.pizza.pate) throw new Error('Le type de pâte est obligatoire');
    if (!this.pizza.sauce) throw new Error('La sauce est obligatoire');

    const pizza = this.pizza;
    this.reset(); // Préparer le builder pour une nouvelle pizza
    return pizza;
  }
}

// Directeur: Définit l'ordre des étapes de construction et crée des configurations prédéfinies
class PizzaDirector {
  constructor(builder) {
    this.builder = builder;
  }

  creerPizzaMargherita(taille = 'moyenne') {
    return this.builder
      .reset()
      .taille(taille)
      .pate('classique')
      .sauce('tomate')
      .fromage('mozzarella')
      .ajouterGarniture('basilic')
      .cuisson('standard')
      .construire();
  }

  creerPizzaVegetarienne(taille = 'grande') {
    return this.builder
      .reset()
      .taille(taille)
      .pate('fine')
      .sauce('tomate')
      .fromage('mozzarella')
      .ajouterGarniture('poivrons')
      .ajouterGarniture('oignons')
      .ajouterGarniture('champignons')
      .ajouterGarniture('olives')
      .cuisson('légère')
      .construire();
  }

  creerPizzaHawaienne(taille = 'moyenne') {
    return this.builder
      .reset()
      .taille(taille)
      .pate('classique')
      .sauce('tomate')
      .fromage('mozzarella')
      .ajouterGarniture('jambon')
      .ajouterGarniture('ananas')
      .cuisson('bien cuite')
      .construire();
  }
}

// Utilisation avec le Builder Pattern

// Créer le builder
const pizzaBuilder = new PizzaBuilder();

// Construction manuelle avec le builder (interface fluide)
console.log("Construction d'une pizza avec le builder:");
try {
  const pizzaPersonnalisee = pizzaBuilder
    .taille('extra-large')
    .pate('à bord farci')
    .sauce('crème fraîche')
    .fromage('cheddar')
    .ajouterGarniture('poulet')
    .ajouterGarniture('bacon')
    .ajouterGarniture('oignons')
    .ajouterGarniture('maïs')
    .cuisson('croustillante')
    .construire();

  pizzaPersonnalisee.afficherDetails();
} catch (error) {
  console.error(`Erreur: ${error.message}`);
}

// Utilisation du directeur pour créer des pizzas prédéfinies
const directeur = new PizzaDirector(pizzaBuilder);

// Créer des pizzas prédéfinies
const margherita = directeur.creerPizzaMargherita();
const vegetarienne = directeur.creerPizzaVegetarienne('grande');
const hawaienne = directeur.creerPizzaHawaienne();

margherita.afficherDetails();
vegetarienne.afficherDetails();
hawaienne.afficherDetails();

// Pizza sans fromage (facile à spécifier avec le builder)
try {
  const pizzaSansFromage = pizzaBuilder
    .taille('petite')
    .pate('épaisse')
    .sauce('tomate')
    // Pas besoin de spécifier le fromage
    .ajouterGarniture('ail')
    .ajouterGarniture('basilic')
    .cuisson('bien cuite')
    .construire();

  pizzaSansFromage.afficherDetails();
} catch (error) {
  console.error(`Erreur: ${error.message}`);
}

// Gestion des erreurs (validation des entrées)
try {
  const pizzaInvalide = pizzaBuilder
    .taille('gigantesque') // Taille invalide
    .pate('classique')
    .sauce('tomate')
    .construire();
} catch (error) {
  console.error(`Erreur de validation: ${error.message}`);
}
