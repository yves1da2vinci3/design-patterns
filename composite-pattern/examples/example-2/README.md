# Pattern Composite - Système de Gestion de Menus de Restaurant

## Le problème

La conception d'un système de gestion de menus pour un restaurant présente plusieurs défis:

- Les menus ont une structure hiérarchique naturelle (catégories, sous-catégories, plats individuels)
- Un menu peut contenir des éléments simples (plats) ou des groupes d'éléments (catégories, menus spéciaux)
- Différents types d'éléments doivent pouvoir être traités de façon uniforme (affichage, calcul de prix)
- La structure peut devenir complexe avec des menus imbriqués (menus pour deux, formules du jour)

Sans un pattern adapté, nous serions contraints de créer différentes classes avec des interfaces similaires mais pas identiques, ce qui conduirait à du code complexe avec beaucoup de conditions pour distinguer les types d'éléments.

## La solution: Pattern Composite

Le Pattern Composite nous permet de composer des objets en structures arborescentes pour représenter des hiérarchies partie-tout. Il permet aux clients de traiter de manière uniforme les objets individuels (les plats) et les compositions d'objets (les catégories et menus).

## Structure de l'exemple

### L'implémentation de base (sans Composite)

Dans l'implémentation sans le Pattern Composite (`basicCode.js`), nous avons:

1. Une classe `Plat` pour les plats individuels
2. Une classe `CategoriePlats` pour les catégories
3. Une classe `MenuSpecial` pour les menus spéciaux
4. Une classe `CarteRestaurant` pour gérer l'ensemble

Chaque classe a sa propre implémentation des méthodes `afficher()` et `getPrix()`, souvent avec du code dupliqué.

```javascript
// Approche sans Composite: classes distinctes avec des interfaces similaires
class Plat {
  // ...
  afficher() {
    /* ... */
  }
  getPrix() {
    /* ... */
  }
}

class CategoriePlats {
  // ...
  afficher() {
    /* ... */
  }
  getPrixTotal() {
    /* ... */
  } // Remarquez le nom différent de la méthode
}

class MenuSpecial {
  // ...
  afficher() {
    /* ... */
  }
  getPrix() {
    /* ... */
  }
}
```

Cette approche rend difficile la gestion de structures imbriquées comme "un menu dans un menu" et oblige le code client à traiter différemment chaque type d'élément.

### L'implémentation avec le Pattern Composite

Dans l'implémentation refactorisée (`refactorCode.js`), nous avons:

1. Une classe abstraite `ElementMenu` (Composant) qui définit l'interface commune
2. Une classe `Plat` (Feuille) pour les éléments qui n'ont pas d'enfants
3. Une classe `CategorieMenu` (Composite) pour les éléments qui peuvent contenir d'autres éléments
4. Des classes spécialisées comme `MenuSpecial` qui étendent le composite de base

#### La structure du code

```
ElementMenu (Composant Abstrait)
  ├── Plat (Feuille)
  └── CategorieMenu (Composite)
        ├── MenuSpecial (Composite Spécialisé)
        └── CarteRestaurant (Composite Racine)
```

#### Le composant abstrait

```javascript
class ElementMenu {
  constructor(nom, description = '') {
    this.nom = nom;
    this.description = description;
  }

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
}
```

#### La classe feuille

```javascript
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
```

#### La classe composite

```javascript
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
    // Afficher le nom de la catégorie
    // Puis afficher récursivement tous les éléments enfants
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
```

### Utilisation du pattern

Le Pattern Composite permet de créer facilement des structures arborescentes complexes:

```javascript
// Création d'une structure imbriquée
const menuPourDeux = new CategorieMenu(
  'Menu Pour Deux',
  'Parfait pour partager en couple'
);

// Ajout d'une sous-catégorie
const entreesPartage = new CategorieMenu('Entrées à Partager');
entreesPartage.ajouter(new Plat('Plateau de Charcuterie', 14.0));

// Ajout de menus individuels (qui sont aussi des composites)
const menuIndividuel1 = new MenuSpecial('Option 1', 'Premier convive');
menuIndividuel1.ajouter(steakFrites).ajouter(mousseChoco);

// Structure imbriquée: menuPourDeux contient entreesPartage et deux menus individuels
menuPourDeux
  .ajouter(entreesPartage)
  .ajouter(menuIndividuel1)
  .ajouter(menuIndividuel2);
```

## Avantages du Pattern Composite

1. **Interface unifiée**

   - Tous les éléments partagent la même interface (`ElementMenu`)
   - Les méthodes `afficher()` et `getPrix()` sont disponibles sur tous les éléments

2. **Structures arborescentes flexibles**

   - Facilité à créer des menus imbriqués à n'importe quelle profondeur
   - Un menu peut contenir des plats, des catégories, ou d'autres menus

3. **Principe ouvert/fermé**

   - Ajout facile de nouveaux types d'éléments sans modifier le code existant
   - On peut créer de nouvelles classes spécialisées (comme `MenuSpecial`) qui s'intègrent parfaitement

4. **Code client simplifié**

   - Le code client traite de manière uniforme les objets individuels et les compositions
   - Pas besoin de conditions pour distinguer les types d'éléments

5. **Récursion naturelle**
   - Le pattern favorise un traitement récursif élégant des structures arborescentes
   - L'affichage et le calcul des prix s'effectuent récursivement

## Cas concrets d'utilisation dans un restaurant

- **Menus dynamiques**: Création de menus personnalisés en fonction des ingrédients disponibles
- **Calcul de prix complexes**: Gestion facile des remises, menus combinés et offres spéciales
- **Impression de menus**: Génération de menus imprimés avec différents niveaux de détails
- **Menus numériques**: Affichage de menus sur tablettes avec navigation dans les catégories
- **Gestion des stocks**: Vérification de la disponibilité des ingrédients pour tous les plats d'un menu

## Conclusion

Le Pattern Composite offre une solution élégante pour la gestion des menus de restaurant en permettant de traiter uniformément les plats individuels et les groupes de plats. Cette approche simplifie considérablement le code tout en offrant une grande flexibilité pour créer des structures de menus complexes.
