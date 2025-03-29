// Implémentation sans le Composite Pattern
// Exemple de structure de fichiers et dossiers

// Fichier simple
class File {
  constructor(name, size) {
    this.name = name;
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

// Dossier contenant des fichiers
class Directory {
  constructor(name) {
    this.name = name;
    this.files = [];
  }

  add(file) {
    this.files.push(file);
  }

  getSize() {
    let totalSize = 0;
    for (const file of this.files) {
      totalSize += file.getSize();
    }
    return totalSize;
  }

  display(indent = 0) {
    console.log(
      `${'  '.repeat(indent)}Dossier: ${this.name} (${this.getSize()} Ko)`
    );
    for (const file of this.files) {
      if (file instanceof File) {
        file.display(indent + 1);
      } else if (file instanceof Directory) {
        file.display(indent + 1);
      }
    }
  }
}

// Utilisation (problématique)
// Créer des fichiers
const file1 = new File('document.txt', 100);
const file2 = new File('image.jpg', 2000);
const file3 = new File('data.csv', 500);

// Créer des dossiers
const musicDir = new Directory('Musique');
const file4 = new File('chanson1.mp3', 3000);
const file5 = new File('chanson2.mp3', 3500);
musicDir.add(file4);
musicDir.add(file5);

const docsDir = new Directory('Documents');
docsDir.add(file1);
docsDir.add(file3);

const rootDir = new Directory('Racine');
rootDir.add(file2);
rootDir.add(musicDir);
rootDir.add(docsDir);

// Afficher la structure
rootDir.display();

// Problèmes:
// 1. Le code pour traiter les fichiers et les dossiers est différent, il faut vérifier le type
// 2. Si on ajoute un nouveau type (par exemple, un raccourci ou un lien symbolique), on doit modifier plusieurs endroits
// 3. La méthode d'affichage doit comprendre et gérer les différents types manuellement
