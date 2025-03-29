// Implémentation sans le Builder Pattern
// Exemple de création d'un objet Pizza avec de nombreux paramètres

class Pizza {
  constructor(taille, pate, sauce, fromage, garnitures) {
    this.taille = taille;
    this.pate = pate;
    this.sauce = sauce;
    this.fromage = fromage;
    this.garnitures = garnitures || [];
  }

  afficherDetails() {
    console.log('----- Pizza -----');
    console.log(`Taille: ${this.taille}`);
    console.log(`Pâte: ${this.pate}`);
    console.log(`Sauce: ${this.sauce}`);
    console.log(`Fromage: ${this.fromage || 'Aucun'}`);
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

// Utilisation sans Builder (problématique)

// Pizza basique avec tous les paramètres explicites
const pizzaBasic = new Pizza('moyenne', 'classique', 'tomate', 'mozzarella', [
  'jambon',
  'champignons',
]);
pizzaBasic.afficherDetails();

// Pizza végétarienne - doit spécifier tous les paramètres même si certains sont inutiles
const pizzaVege = new Pizza('grande', 'fine', 'tomate', 'mozzarella', [
  'poivrons',
  'oignons',
  'olives',
]);
pizzaVege.afficherDetails();

// Pizza sans fromage - on doit passer null/undefined pour le fromage
const pizzaSansFromage = new Pizza('petite', 'épaisse', 'tomate', null, [
  'ail',
  'basilic',
]);
pizzaSansFromage.afficherDetails();

// Pizza personnalisée avec beaucoup de garnitures
const pizzaPersonnalisee = new Pizza(
  'extra-large',
  'à bord farci',
  'crème fraîche',
  'mozzarella',
  ['poulet', 'bacon', 'œuf', 'oignons', 'maïs', 'poivrons', 'olives']
);
pizzaPersonnalisee.afficherDetails();

// Problèmes:
// 1. Nombreux paramètres dans le constructeur rendant l'appel difficile à lire
// 2. Ordre des paramètres fixe et difficile à retenir
// 3. Paramètres optionnels difficiles à gérer (il faut passer null/undefined)
// 4. Pas de contrôle sur le processus de construction (valeurs invalides, combinaisons impossibles)
// 5. Difficile d'ajouter de nouvelles options sans modifier le constructeur
