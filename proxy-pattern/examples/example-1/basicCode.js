// Implémentation sans le Proxy Pattern
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

// Utilisation (problématique)
console.log("Démarrage de l'application...");

// Création de plusieurs images lourdes lors du démarrage, même si elles ne sont pas toutes nécessaires immédiatement
const image1 = new HeavyImage('vacances.jpg');
const image2 = new HeavyImage('famille.jpg');
const image3 = new HeavyImage('travail.jpg');

console.log('Application prête!');

// Utilisation d'une seule image
image1.display();

// Problème: toutes les images sont chargées de manière gourmande (eager loading), ce qui peut ralentir le démarrage
// et consommer des ressources inutilement si certaines images ne sont jamais affichées.
