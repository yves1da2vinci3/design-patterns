// Implémentation avec le Proxy Pattern

// Sujet réel
class HeavyImage {
  constructor(filename) {
    this.filename = filename;
    this.loadImage();
  }

  loadImage() {
    // Simuler un chargement d'image lent et coûteux
    console.log(`Chargement de l'image ${this.filename}...`);
    // Imaginons que cette opération prend beaucoup de temps et de ressources
    for (let i = 0; i < 1000000; i++) {
      // Simulation d'un travail intensif
    }
    console.log(`Image ${this.filename} chargée avec succès!`);
  }

  display() {
    console.log(`Affichage de l'image: ${this.filename}`);
  }

  getMetadata() {
    return {
      filename: this.filename,
      size: '10MB',
      dimensions: '1920x1080',
    };
  }
}

// Proxy virtuel (Virtual Proxy)
class ImageProxy {
  constructor(filename) {
    this.filename = filename;
    this.image = null; // L'image réelle n'est pas créée immédiatement
  }

  // Lazy loading: charge l'image seulement lorsqu'elle est nécessaire
  display() {
    if (this.image === null) {
      console.log(
        `Proxy: Premier accès à ${this.filename}, chargement maintenant...`
      );
      this.image = new HeavyImage(this.filename);
    }
    this.image.display();
  }

  // Pas besoin de charger l'image complète pour les métadonnées
  getMetadata() {
    console.log(
      `Proxy: Accès aux métadonnées pour ${this.filename} sans charger l'image complète.`
    );
    return {
      filename: this.filename,
      size: '10MB', // Ces informations pourraient être stockées séparément ou obtenues plus efficacement
      dimensions: '1920x1080',
    };
  }
}

// Utilisation avec le Proxy Pattern
console.log("Démarrage de l'application...");

// Création de plusieurs proxys d'images (création légère, pas de chargement réel)
const imageProxy1 = new ImageProxy('vacances.jpg');
const imageProxy2 = new ImageProxy('famille.jpg');
const imageProxy3 = new ImageProxy('travail.jpg');

console.log('Application prête! (beaucoup plus rapide)');

// Accéder aux métadonnées sans charger l'image complète
const metadata = imageProxy1.getMetadata();
console.log('Métadonnées:', metadata);

// Seule l'image qui est réellement affichée est chargée
imageProxy1.display();

// Les autres images ne sont jamais chargées si elles ne sont pas utilisées
console.log(
  "Les autres images n'ont pas été chargées, économisant des ressources!"
);

// Si nous affichons la même image à nouveau, elle est déjà chargée en mémoire
console.log("\nAffichage de l'image à nouveau:");
imageProxy1.display(); // Pas de rechargement
