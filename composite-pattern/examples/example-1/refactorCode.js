// Implémentation avec le Composite Pattern
// Exemple de structure de fichiers et dossiers

// Composant (interface commune)
class FileSystemComponent {
  constructor(name) {
    this.name = name;
  }

  getSize() {
    throw new Error('Méthode getSize() doit être implémentée');
  }

  display(indent = 0) {
    throw new Error('Méthode display() doit être implémentée');
  }

  // Opération commune à tous les composants
  getPath(parentPath = '') {
    return parentPath ? `${parentPath}/${this.name}` : this.name;
  }
}

// Feuille (objet primitif)
class File extends FileSystemComponent {
  constructor(name, size) {
    super(name);
    this.size = size; // Taille en Ko
  }

  getSize() {
    return this.size;
  }

  display(indent = 0) {
    console.log(
      `${'  '.repeat(indent)}Fichier: ${this.name} (${this.size} Ko)`
    );
  }
}

// Composite (objet complexe qui peut contenir d'autres objets)
class Directory extends FileSystemComponent {
  constructor(name) {
    super(name);
    this.children = []; // Peut contenir des Files ou d'autres Directories
  }

  add(component) {
    this.children.push(component);
    return this; // Pour permettre le chaînage
  }

  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
    return this;
  }

  getSize() {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  display(indent = 0) {
    console.log(
      `${'  '.repeat(indent)}Dossier: ${this.name} (${this.getSize()} Ko)`
    );

    // Pas besoin de vérifier le type, on traite tous les enfants de la même façon
    this.children.forEach((child) => child.display(indent + 1));
  }

  // Méthode spécifique au Directory
  find(name) {
    if (this.name === name) return this;

    for (const child of this.children) {
      if (child instanceof Directory) {
        const found = child.find(name);
        if (found) return found;
      } else if (child.name === name) {
        return child;
      }
    }

    return null;
  }
}

// Extension du système: ajout d'un nouveau type de composant
class Shortcut extends FileSystemComponent {
  constructor(name, target) {
    super(name);
    this.target = target;
  }

  getSize() {
    return 1; // Les raccourcis ont généralement une taille fixe très petite
  }

  display(indent = 0) {
    console.log(
      `${'  '.repeat(indent)}Raccourci: ${this.name} -> ${
        this.target.name
      } (${this.getSize()} Ko)`
    );
  }

  // Délégation au composant cible
  getTargetSize() {
    return this.target.getSize();
  }
}

// Utilisation avec le Composite Pattern
// Créer des fichiers (feuilles)
const file1 = new File('document.txt', 100);
const file2 = new File('image.jpg', 2000);
const file3 = new File('data.csv', 500);
const file4 = new File('chanson1.mp3', 3000);
const file5 = new File('chanson2.mp3', 3500);

// Créer des dossiers (composites)
const musicDir = new Directory('Musique');
musicDir.add(file4).add(file5); // Utilisation du chaînage

const docsDir = new Directory('Documents');
docsDir.add(file1).add(file3);

const rootDir = new Directory('Racine');
rootDir.add(file2).add(musicDir).add(docsDir);

// Ajouter un raccourci (nouveau type de composant)
const shortcut = new Shortcut('doc-shortcut.lnk', file1);
rootDir.add(shortcut);

// Afficher la structure complète avec tous les types de composants
console.log('Structure du système de fichiers:');
rootDir.display();

// Obtenir la taille totale (traite tous les composants de manière uniforme)
console.log(`\nTaille totale: ${rootDir.getSize()} Ko`);

// Rechercher un élément dans la structure
const foundItem = rootDir.find('Documents');
if (foundItem) {
  console.log(`\nÉlément trouvé: ${foundItem.name}`);
  console.log(`Taille: ${foundItem.getSize()} Ko`);
}
