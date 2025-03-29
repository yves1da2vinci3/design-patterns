// Implémentation sans le Prototype Pattern
// Exemple de création d'objets similaires mais avec des configurations différentes

class Voiture {
  constructor(marque, modele, couleur, nombreDePortes, options) {
    this.marque = marque;
    this.modele = modele;
    this.couleur = couleur;
    this.nombreDePortes = nombreDePortes;
    this.options = options || {};
    this.dateCreation = new Date();

    // Supposons qu'il y ait une configuration complexe ici
    this.initialiserMoteur();
    this.configurerElectronique();
    this.preparerInterieur();
  }

  initialiserMoteur() {
    console.log(
      `Initialisation du moteur pour ${this.marque} ${this.modele}...`
    );
    // Logique complexe...
    this.moteur = {
      type: this.options.typeMoteur || 'essence',
      puissance: this.options.puissanceMoteur || 100,
      // ...
    };
  }

  configurerElectronique() {
    console.log(`Configuration de l'électronique...`);
    // Logique complexe...
    this.electronique = {
      gps: this.options.gps || false,
      bluetooth: this.options.bluetooth || false,
      assistanceConduite: this.options.assistanceConduite || false,
      // ...
    };
  }

  preparerInterieur() {
    console.log(`Préparation de l'intérieur...`);
    // Logique complexe...
    this.interieur = {
      materiauSieges: this.options.materiauSieges || 'tissu',
      climatisation: this.options.climatisation || false,
      // ...
    };
  }

  afficherDetails() {
    console.log(`
      Voiture: ${this.marque} ${this.modele}
      Couleur: ${this.couleur}
      Portes: ${this.nombreDePortes}
      Moteur: ${this.moteur.type}, ${this.moteur.puissance}cv
      GPS: ${this.electronique.gps ? 'Oui' : 'Non'}
      Créée le: ${this.dateCreation.toLocaleString()}
    `);
  }
}

// Utilisation sans prototype (problématique)
console.log('Création de voitures sans prototype:');

// Création d'une voiture de base
const voitureBase = new Voiture('Renault', 'Clio', 'Blanc', 5, {
  typeMoteur: 'essence',
  puissanceMoteur: 90,
  materiauSieges: 'tissu',
  climatisation: true,
});

// Pour créer une variante, on doit recréer entièrement l'objet
// même si la plupart des propriétés sont identiques
const voitureLuxe = new Voiture('Renault', 'Clio', 'Noir', 5, {
  typeMoteur: 'essence',
  puissanceMoteur: 110,
  materiauSieges: 'cuir',
  climatisation: true,
  gps: true,
  bluetooth: true,
  assistanceConduite: true,
});

// Encore une autre variante
const voitureSport = new Voiture('Renault', 'Clio RS', 'Rouge', 3, {
  typeMoteur: 'essence',
  puissanceMoteur: 200,
  materiauSieges: 'cuir',
  climatisation: true,
  gps: true,
  bluetooth: true,
});

// Affichage des détails
voitureBase.afficherDetails();
voitureLuxe.afficherDetails();
voitureSport.afficherDetails();

// Problèmes:
// 1. Création redondante d'objets similaires avec répétition des propriétés
// 2. Coût de performance élevé pour chaque nouvelle instance (initialisation, configuration...)
// 3. Difficulté à créer des variations à partir d'un modèle de base
// 4. Si le processus de création change, il faut modifier chaque point de création
