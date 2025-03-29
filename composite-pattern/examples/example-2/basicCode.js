// Implémentation sans le Pattern Composite
// Exemple: Système de gestion de menus de restaurant

// Classe pour un plat individuel
class Plat {
  constructor(nom, prix, description) {
    this.nom = nom;
    this.prix = prix;
    this.description = description;
  }

  afficher() {
    console.log(`${this.nom} - ${this.prix}€`);
    console.log(`  Description: ${this.description}`);
  }

  getPrix() {
    return this.prix;
  }
}

// Classe pour une catégorie de plats
class CategoriePlats {
  constructor(nom) {
    this.nom = nom;
    this.plats = [];
  }

  ajouterPlat(plat) {
    this.plats.push(plat);
  }

  afficher() {
    console.log(`=== ${this.nom.toUpperCase()} ===`);
    for (const plat of this.plats) {
      plat.afficher();
    }
  }

  getPrixTotal() {
    let total = 0;
    for (const plat of this.plats) {
      total += plat.getPrix();
    }
    return total;
  }
}

// Classe pour un menu spécial (qui contient plusieurs plats)
class MenuSpecial {
  constructor(nom, description) {
    this.nom = nom;
    this.description = description;
    this.plats = [];
  }

  ajouterPlat(plat) {
    this.plats.push(plat);
  }

  afficher() {
    console.log(`*** MENU SPÉCIAL: ${this.nom} ***`);
    console.log(`Description: ${this.description}`);
    console.log('Comprend:');
    for (const plat of this.plats) {
      console.log(`- ${plat.nom}`);
    }
    console.log(`Prix total du menu: ${this.getPrix()}€`);
  }

  getPrix() {
    // Les menus spéciaux ont souvent un prix fixe ou une remise
    let total = 0;
    for (const plat of this.plats) {
      total += plat.getPrix();
    }
    // Appliquer une réduction de 10% pour le menu spécial
    return Math.round(total * 0.9 * 100) / 100;
  }
}

// Classe pour la carte complète du restaurant
class CarteRestaurant {
  constructor(nomRestaurant) {
    this.nomRestaurant = nomRestaurant;
    this.categories = [];
    this.menusSpeciaux = [];
  }

  ajouterCategorie(categorie) {
    this.categories.push(categorie);
  }

  ajouterMenuSpecial(menu) {
    this.menusSpeciaux.push(menu);
  }

  afficher() {
    console.log(`\n============================================`);
    console.log(`     CARTE DE ${this.nomRestaurant.toUpperCase()}`);
    console.log(`============================================\n`);

    for (const categorie of this.categories) {
      categorie.afficher();
      console.log(''); // Ligne vide pour la lisibilité
    }

    if (this.menusSpeciaux.length > 0) {
      console.log(`\n============================================`);
      console.log(`             MENUS SPÉCIAUX`);
      console.log(`============================================\n`);

      for (const menu of this.menusSpeciaux) {
        menu.afficher();
        console.log(''); // Ligne vide pour la lisibilité
      }
    }
  }
}

// Utilisation du système sans pattern Composite
// Création des plats individuels
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

// Création des catégories
const entrees = new CategoriePlats('Entrées');
entrees.ajouterPlat(saladeCesar);
entrees.ajouterPlat(soupeOignon);
entrees.ajouterPlat(foieGras);

const plats = new CategoriePlats('Plats Principaux');
plats.ajouterPlat(steakFrites);
plats.ajouterPlat(saumonGrille);
plats.ajouterPlat(risottoChampi);

const desserts = new CategoriePlats('Desserts');
desserts.ajouterPlat(mousseChoco);
desserts.ajouterPlat(tiramisu);
desserts.ajouterPlat(fondantChoco);

// Création de menus spéciaux
const menuDegustation = new MenuSpecial(
  'Menu Dégustation',
  'Une sélection de nos meilleurs plats'
);
menuDegustation.ajouterPlat(foieGras);
menuDegustation.ajouterPlat(saumonGrille);
menuDegustation.ajouterPlat(tiramisu);

const menuVegetarien = new MenuSpecial(
  'Menu Végétarien',
  'Sélection de plats sans viande'
);
menuVegetarien.ajouterPlat(saladeCesar);
menuVegetarien.ajouterPlat(risottoChampi);
menuVegetarien.ajouterPlat(mousseChoco);

// Création de la carte complète
const carte = new CarteRestaurant('Le Bon Goût');
carte.ajouterCategorie(entrees);
carte.ajouterCategorie(plats);
carte.ajouterCategorie(desserts);
carte.ajouterMenuSpecial(menuDegustation);
carte.ajouterMenuSpecial(menuVegetarien);

// Affichage de la carte
carte.afficher();

// Problèmes avec cette approche:
console.log('\n=== PROBLÈMES AVEC CETTE APPROCHE ===');
console.log(
  '1. Code non uniforme - Différentes classes (Plat, CategoriePlats, MenuSpecial) avec des interfaces similaires mais pas identiques'
);
console.log(
  '2. Difficulté à créer des structures imbriquées - Par exemple, un menu dans un menu ou des sous-catégories'
);
console.log(
  "3. Le code client doit connaître les types spécifiques - Traitement différent selon le type d'élément"
);
console.log(
  '4. Duplication de code - Méthodes similaires réimplémentées dans chaque classe'
);
console.log(
  "5. Extensibilité limitée - Difficile d'ajouter de nouveaux types d'éléments sans modifier beaucoup de code"
);
