// Implémentation avec le Pattern Composite
// Exemple: Système de gestion de menus de restaurant

// Composant abstrait - Interface commune pour tous les éléments de menu
class ElementMenu {
  constructor(nom, description = '') {
    this.nom = nom;
    this.description = description;
  }

  // Méthodes communes que tous les composants doivent implémenter
  afficher(indentation = 0) {
    throw new Error(
      'La méthode afficher doit être implémentée par les sous-classes'
    );
  }

  getPrix() {
    throw new Error(
      'La méthode getPrix doit être implémentée par les sous-classes'
    );
  }

  // Méthodes utiles pour gérer l'indentation dans l'affichage
  getIndentation(niveau) {
    return '  '.repeat(niveau);
  }
}

// Classe Feuille - Représente un plat individuel (élément terminal)
class Plat extends ElementMenu {
  constructor(nom, prix, description) {
    super(nom, description);
    this.prix = prix;
  }

  afficher(indentation = 0) {
    const indent = this.getIndentation(indentation);
    console.log(`${indent}${this.nom} - ${this.prix}€`);
    if (this.description) {
      console.log(`${indent}  Description: ${this.description}`);
    }
  }

  getPrix() {
    return this.prix;
  }
}

// Classe Composite - Peut contenir d'autres éléments (plats ou catégories)
class CategorieMenu extends ElementMenu {
  constructor(nom, description = '') {
    super(nom, description);
    this.elements = [];
  }

  ajouter(element) {
    this.elements.push(element);
    return this; // Pour permettre le chaînage des appels
  }

  supprimer(element) {
    const index = this.elements.indexOf(element);
    if (index >= 0) {
      this.elements.splice(index, 1);
    }
    return this;
  }

  afficher(indentation = 0) {
    const indent = this.getIndentation(indentation);
    console.log(`${indent}=== ${this.nom.toUpperCase()} ===`);
    if (this.description) {
      console.log(`${indent}${this.description}`);
    }

    for (const element of this.elements) {
      element.afficher(indentation + 1);
    }
  }

  getPrix() {
    return this.elements.reduce(
      (total, element) => total + element.getPrix(),
      0
    );
  }
}

// Classe spécialisée pour les menus avec remise - toujours un composite
class MenuSpecial extends CategorieMenu {
  constructor(nom, description = '', remisePourcentage = 10) {
    super(nom, description);
    this.remisePourcentage = remisePourcentage;
  }

  afficher(indentation = 0) {
    const indent = this.getIndentation(indentation);
    console.log(`${indent}*** MENU SPÉCIAL: ${this.nom} ***`);
    if (this.description) {
      console.log(`${indent}Description: ${this.description}`);
    }
    console.log(`${indent}Remise: ${this.remisePourcentage}%`);
    console.log(`${indent}Comprend:`);

    for (const element of this.elements) {
      element.afficher(indentation + 1);
    }

    console.log(`${indent}Prix total du menu: ${this.getPrix().toFixed(2)}€`);
  }

  getPrix() {
    const prixSansRemise = super.getPrix();
    const remise = prixSansRemise * (this.remisePourcentage / 100);
    return Math.round((prixSansRemise - remise) * 100) / 100;
  }
}

// Classe racine pour la carte du restaurant - utilise également le pattern composite
class CarteRestaurant extends CategorieMenu {
  constructor(nomRestaurant) {
    super(nomRestaurant, 'Carte complète du restaurant');
  }

  afficher(indentation = 0) {
    console.log(`\n============================================`);
    console.log(`     CARTE DE ${this.nom.toUpperCase()}`);
    console.log(`============================================\n`);

    for (const element of this.elements) {
      element.afficher(indentation);
      console.log(''); // Ligne vide pour la lisibilité
    }
  }
}

// Utilisation du pattern Composite
// Création des plats individuels (feuilles)
const saladeCesar = new Plat(
  'Salade César',
  8.5,
  'Laitue romaine, parmesan, croûtons et sauce César'
);
const soupeOignon = new Plat(
  "Soupe à l'oignon",
  7.0,
  "Soupe à l'oignon gratinée au fromage"
);
const foieGras = new Plat(
  'Foie Gras',
  15.0,
  "Foie gras maison et sa confiture d'oignons"
);

const steakFrites = new Plat(
  'Steak Frites',
  18.5,
  'Steak de bœuf et frites maison'
);
const saumonGrille = new Plat(
  'Saumon Grillé',
  16.0,
  'Filet de saumon grillé, légumes de saison'
);
const risottoChampi = new Plat(
  'Risotto aux Champignons',
  14.5,
  'Risotto crémeux aux champignons sauvages'
);

const mousseChoco = new Plat(
  'Mousse au Chocolat',
  6.5,
  'Mousse au chocolat noir maison'
);
const tiramisu = new Plat('Tiramisu', 7.0, 'Tiramisu traditionnel au café');
const fondantChoco = new Plat(
  'Fondant au Chocolat',
  7.5,
  'Fondant au chocolat cœur coulant et sa glace vanille'
);

// Création des catégories (composites)
const entrees = new CategorieMenu('Entrées');
entrees.ajouter(saladeCesar).ajouter(soupeOignon).ajouter(foieGras);

const plats = new CategorieMenu('Plats Principaux');
plats.ajouter(steakFrites).ajouter(saumonGrille).ajouter(risottoChampi);

const desserts = new CategorieMenu('Desserts');
desserts.ajouter(mousseChoco).ajouter(tiramisu).ajouter(fondantChoco);

// Création de menus spéciaux (composites avec remise)
const menuDegustation = new MenuSpecial(
  'Menu Dégustation',
  'Une sélection de nos meilleurs plats',
  10
);
menuDegustation.ajouter(foieGras).ajouter(saumonGrille).ajouter(tiramisu);

const menuVegetarien = new MenuSpecial(
  'Menu Végétarien',
  'Sélection de plats sans viande',
  15
);
menuVegetarien.ajouter(saladeCesar).ajouter(risottoChampi).ajouter(mousseChoco);

// Création d'un menu pour deux personnes (composite qui contient d'autres composites)
const menuPourDeux = new CategorieMenu(
  'Menu Pour Deux',
  'Parfait pour partager en couple'
);
// On crée des copies des plats pour ce menu
const entreesPartage = new CategorieMenu('Entrées à Partager');
entreesPartage.ajouter(
  new Plat('Plateau de Charcuterie', 14.0, 'Assortiment de charcuteries fines')
);

// On ajoute deux menus individuels dans le menu pour deux
const menuIndividuel1 = new MenuSpecial('Option 1', 'Premier convive', 5);
menuIndividuel1.ajouter(steakFrites).ajouter(mousseChoco);

const menuIndividuel2 = new MenuSpecial('Option 2', 'Deuxième convive', 5);
menuIndividuel2.ajouter(saumonGrille).ajouter(tiramisu);

// Structure imbriquée: menuPourDeux contient entreesPartage et deux menus individuels
menuPourDeux
  .ajouter(entreesPartage)
  .ajouter(menuIndividuel1)
  .ajouter(menuIndividuel2);

// Création de la carte complète (racine de l'arborescence)
const carte = new CarteRestaurant('Le Bon Goût');
carte
  .ajouter(entrees)
  .ajouter(plats)
  .ajouter(desserts)
  .ajouter(
    new CategorieMenu('Menus Spéciaux', 'Nos offres avec remise')
      .ajouter(menuDegustation)
      .ajouter(menuVegetarien)
      .ajouter(menuPourDeux)
  );

// Affichage de la carte
carte.afficher();

// On peut facilement ajouter un nouveau plat à une catégorie
console.log("\n=== AJOUT D'UN NOUVEAU PLAT ===");
const patesCarbonara = new Plat(
  'Pâtes Carbonara',
  13.5,
  'Pâtes fraîches à la crème et aux lardons'
);
plats.ajouter(patesCarbonara);
console.log('Plats après ajout:');
plats.afficher();

// On peut aussi créer des sous-catégories
console.log("\n=== CRÉATION D'UNE SOUS-CATÉGORIE ===");
const dessertsGlaces = new CategorieMenu('Glaces et Sorbets');
dessertsGlaces
  .ajouter(new Plat('Coupe 3 Boules', 6.0, 'Vanille, Chocolat, Fraise'))
  .ajouter(new Plat('Sorbet Citron', 5.5, 'Sorbet au citron fait maison'));
desserts.ajouter(dessertsGlaces);
console.log('Desserts avec sous-catégorie:');
desserts.afficher();

// Calculer le prix total d'un menu
console.log(
  `\nPrix total du menu dégustation: ${menuDegustation.getPrix().toFixed(2)}€`
);
console.log(
  `Prix total du menu pour deux: ${menuPourDeux.getPrix().toFixed(2)}€`
);

// Avantages du Pattern Composite
console.log('\n=== AVANTAGES DU PATTERN COMPOSITE ===');
console.log(
  '1. Interface unifiée - Tous les éléments partagent la même interface (ElementMenu)'
);
console.log(
  "2. Structures arborescentes flexibles - Facilité à créer des menus imbriqués à n'importe quelle profondeur"
);
console.log(
  "3. Principe ouvert/fermé - Ajout facile de nouveaux types d'éléments sans modifier le code existant"
);
console.log(
  '4. Code client simplifié - Le code client traite de manière uniforme les objets individuels et les compositions'
);
console.log(
  '5. Réutilisation - Les composants peuvent être réutilisés dans différentes parties de la structure'
);
