// Implémentation avec le Prototype Pattern
// Exemple de création d'objets par clonage d'un prototype

class Voiture {
  constructor(marque, modele, couleur, nombreDePortes, options) {
    this.marque = marque;
    this.modele = modele;
    this.couleur = couleur;
    this.nombreDePortes = nombreDePortes;
    this.options = options || {};
    this.dateCreation = new Date();

    // Configuration initiale
    this.initialiserMoteur();
    this.configurerElectronique();
    this.preparerInterieur();
  }

  initialiserMoteur() {
    console.log(
      `Initialisation du moteur pour ${this.marque} ${this.modele}...`
    );
    this.moteur = {
      type: this.options.typeMoteur || 'essence',
      puissance: this.options.puissanceMoteur || 100,
    };
  }

  configurerElectronique() {
    console.log(`Configuration de l'électronique...`);
    this.electronique = {
      gps: this.options.gps || false,
      bluetooth: this.options.bluetooth || false,
      assistanceConduite: this.options.assistanceConduite || false,
    };
  }

  preparerInterieur() {
    console.log(`Préparation de l'intérieur...`);
    this.interieur = {
      materiauSieges: this.options.materiauSieges || 'tissu',
      climatisation: this.options.climatisation || false,
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

  // Méthode de clonage (shallow clone)
  clone() {
    // Créer un nouvel objet avec le prototype de l'objet courant
    const clone = Object.create(Object.getPrototypeOf(this));

    // Copier les propriétés de l'objet courant
    const props = Object.getOwnPropertyDescriptors(this);
    Object.defineProperties(clone, props);

    // Réinitialiser la date de création
    clone.dateCreation = new Date();

    // Créer des copies des objets imbriqués pour éviter les références partagées (deep clone)
    clone.options = { ...this.options };
    clone.moteur = { ...this.moteur };
    clone.electronique = { ...this.electronique };
    clone.interieur = { ...this.interieur };

    return clone;
  }

  // Méthode pour modifier un clone après sa création
  configure(config) {
    // Mettre à jour les propriétés de base
    Object.keys(config).forEach((key) => {
      if (key !== 'options') {
        this[key] = config[key];
      }
    });

    // Mettre à jour les options
    if (config.options) {
      this.options = { ...this.options, ...config.options };

      // Reconfigurer les sous-systèmes si nécessaire
      if (Object.keys(config.options).some((key) => key.includes('Moteur'))) {
        this.initialiserMoteur();
      }

      if (
        Object.keys(config.options).some((key) =>
          ['gps', 'bluetooth', 'assistanceConduite'].includes(key)
        )
      ) {
        this.configurerElectronique();
      }

      if (
        Object.keys(config.options).some((key) =>
          ['materiauSieges', 'climatisation'].includes(key)
        )
      ) {
        this.preparerInterieur();
      }
    }

    return this;
  }
}

// Registre de prototypes
class VoitureRegistry {
  constructor() {
    this.prototypes = {};
  }

  register(key, prototype) {
    this.prototypes[key] = prototype;
  }

  unregister(key) {
    delete this.prototypes[key];
  }

  getPrototype(key) {
    return this.prototypes[key];
  }

  createVoiture(prototypeKey, config) {
    const prototype = this.getPrototype(prototypeKey);
    if (!prototype) {
      throw new Error(`Prototype '${prototypeKey}' non trouvé`);
    }

    // Créer un clone et le configurer
    return prototype.clone().configure(config);
  }
}

// Utilisation avec le Prototype Pattern
console.log('\nCréation de voitures avec prototype:');

// Créer un registre de prototypes
const registry = new VoitureRegistry();

// Créer les prototypes de base (une seule fois)
console.log('\n--- Création des prototypes ---');

// Prototype de Clio standard
const clioPrototype = new Voiture('Renault', 'Clio', 'Blanc', 5, {
  typeMoteur: 'essence',
  puissanceMoteur: 90,
  materiauSieges: 'tissu',
  climatisation: true,
});

// Enregistrer le prototype dans le registre
registry.register('clio', clioPrototype);

// Créer un prototype dérivé pour les modèles de luxe (à partir du prototype de base)
const clioLuxePrototype = clioPrototype.clone().configure({
  couleur: 'Noir',
  options: {
    materiauSieges: 'cuir',
    gps: true,
    bluetooth: true,
  },
});

registry.register('clioLuxe', clioLuxePrototype);

// Créer un prototype pour les modèles sport
const clioSportPrototype = clioPrototype.clone().configure({
  modele: 'Clio RS',
  nombreDePortes: 3,
  options: {
    puissanceMoteur: 200,
    materiauSieges: 'cuir sport',
    assistanceConduite: true,
  },
});

registry.register('clioSport', clioSportPrototype);

// Production de voitures à partir des prototypes
console.log('\n--- Production de voitures ---');

// Créer des instances à partir des prototypes (beaucoup moins coûteux)
const voiture1 = registry.createVoiture('clio', {});
const voiture2 = registry.createVoiture('clioLuxe', {
  couleur: 'Gris Métallisé',
});
const voiture3 = registry.createVoiture('clioSport', {
  couleur: 'Rouge Racing',
  options: {
    puissanceMoteur: 220, // Augmenter encore la puissance
  },
});

// Créer une nouvelle variante à la volée
const voiture4 = registry.createVoiture('clio', {
  couleur: 'Bleu',
  options: {
    typeMoteur: 'hybride',
    puissanceMoteur: 140,
    gps: true,
  },
});

// Affichage des détails
console.log('\n--- Détails des voitures produites ---');
voiture1.afficherDetails();
voiture2.afficherDetails();
voiture3.afficherDetails();
voiture4.afficherDetails();

// Avantages:
// 1. Réduction des coûts de création (évite la réinitialisation complète)
// 2. Centralisation de la configuration initiale dans les prototypes
// 3. Flexibilité pour créer des variantes à partir des prototypes
// 4. Possibilité d'ajouter de nouveaux prototypes à l'exécution
