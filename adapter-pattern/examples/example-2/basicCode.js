// Implémentation sans le Pattern Adapter
// Exemple: Bibliothèque de conversion de formats d'images

// Classe cliente qui traite uniquement les images au format PNG
class ImageEditor {
  constructor() {
    this.name = "Éditeur d'images premium";
    this.supportedFormats = ['PNG'];
    console.log(
      `${this.name} initialisé. Formats supportés: ${this.supportedFormats.join(
        ', '
      )}`
    );
  }

  openFile(filename) {
    // Vérifier le format du fichier
    const extension = filename.split('.').pop().toUpperCase();

    if (this.supportedFormats.includes(extension)) {
      console.log(`Ouverture du fichier ${filename}`);
      return {
        filename,
        format: extension,
        content: `Contenu simulé de l'image ${filename}`,
      };
    } else {
      console.error(
        `Format non supporté: ${extension}. L'éditeur ne prend en charge que ${this.supportedFormats.join(
          ', '
        )}`
      );
      return null;
    }
  }

  editImage(image) {
    if (!image) {
      console.error("Impossible d'éditer une image non valide");
      return;
    }
    console.log(`Édition de l'image ${image.filename}`);
    // Simulation d'opérations d'édition
    console.log(
      'Opérations disponibles: rogner, redimensionner, appliquer des filtres...'
    );
  }

  saveFile(image, newFilename) {
    if (!image) {
      console.error('Impossible de sauvegarder une image non valide');
      return false;
    }
    console.log(`Sauvegarde de l'image sous ${newFilename}`);
    return true;
  }
}

// Bibliothèque de traitement JPEG - code existant que nous voulons utiliser
class JpegProcessor {
  constructor() {
    console.log('Processeur JPEG initialisé');
  }

  loadJpegImage(filename) {
    console.log(`Chargement de l'image JPEG: ${filename}`);
    return {
      jpegFilename: filename,
      jpegData: `Données JPEG de ${filename}`,
      width: 800,
      height: 600,
      resolution: '72dpi',
    };
  }

  getJpegInfo(jpegImage) {
    console.log('Informations JPEG:');
    console.log(`- Nom du fichier: ${jpegImage.jpegFilename}`);
    console.log(`- Dimensions: ${jpegImage.width}x${jpegImage.height}`);
    console.log(`- Résolution: ${jpegImage.resolution}`);
  }

  saveAsJpeg(jpegImage, newFilename) {
    console.log(`Sauvegarde de l'image JPEG sous ${newFilename}`);
    return true;
  }
}

// Bibliothèque de traitement GIF - autre code existant
class GifProcessor {
  constructor() {
    console.log('Processeur GIF initialisé');
  }

  readGifFile(filepath) {
    console.log(`Lecture du fichier GIF: ${filepath}`);
    return {
      name: filepath,
      gifData: `Données GIF de ${filepath}`,
      frameCount: 10,
      animationSpeed: '500ms',
      dimensions: { x: 500, y: 400 },
    };
  }

  extractGifMetadata(gifFile) {
    return {
      frames: gifFile.frameCount,
      speed: gifFile.animationSpeed,
      width: gifFile.dimensions.x,
      height: gifFile.dimensions.y,
    };
  }

  writeGif(gifFile, destinationPath) {
    console.log(`Écriture du GIF vers ${destinationPath}`);
    return {
      success: true,
      path: destinationPath,
    };
  }
}

// Utilisation (sans adapter)
console.log('=== UTILISATION SANS PATTERN ADAPTER ===\n');

// Création de l'éditeur d'images
const editor = new ImageEditor();

// Fichiers à ouvrir
const pngFile = 'image1.png'; // Format supporté
const jpegFile = 'photo.jpeg'; // Format non supporté
const gifFile = 'animation.gif'; // Format non supporté

// Tentative d'ouverture des fichiers
const image1 = editor.openFile(pngFile); // Devrait fonctionner
editor.editImage(image1);

const image2 = editor.openFile(jpegFile); // Échouera
editor.editImage(image2);

const image3 = editor.openFile(gifFile); // Échouera
editor.editImage(image3);

// Pour utiliser les fichiers JPEG et GIF, nous devons utiliser leurs processeurs spécifiques
// et gérer manuellement la conversion si nécessaire

console.log('\n=== UTILISATION MANUELLE DES PROCESSEURS SPÉCIFIQUES ===\n');

// Pour JPEG
const jpegProcessor = new JpegProcessor();
const jpegImage = jpegProcessor.loadJpegImage(jpegFile);
jpegProcessor.getJpegInfo(jpegImage);

// Pour GIF
const gifProcessor = new GifProcessor();
const gifImage = gifProcessor.readGifFile(gifFile);
const gifMetadata = gifProcessor.extractGifMetadata(gifImage);
console.log('Métadonnées GIF:', gifMetadata);

console.log('\n=== PROBLÈMES AVEC CETTE APPROCHE ===');
console.log(
  "1. L'éditeur d'images ne peut pas ouvrir directement les fichiers JPEG et GIF"
);
console.log(
  '2. Le code est complexe et nécessite de gérer manuellement différentes bibliothèques'
);
console.log(
  "3. Pas d'interface unifiée pour traiter différents formats d'images"
);
console.log(
  '4. Modifications importantes requises si nous voulons supporter de nouveaux formats'
);
console.log('5. Duplication de code pour la conversion entre formats');
