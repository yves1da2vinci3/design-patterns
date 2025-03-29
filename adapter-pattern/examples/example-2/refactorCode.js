// Implémentation avec le Pattern Adapter
// Exemple: Bibliothèque de conversion de formats d'images

// L'interface cible attendue par notre éditeur d'images
class Image {
  constructor(filename, format, width, height, data) {
    this.filename = filename;
    this.format = format;
    this.width = width;
    this.height = height;
    this.data = data;
  }
}

// Classe cliente qui traite uniquement les images au format standard (interne)
class ImageEditor {
  constructor() {
    this.name = "Éditeur d'images premium";
    console.log(`${this.name} initialisé`);
  }

  openFile(filename, imageAdapter) {
    console.log(`Tentative d'ouverture du fichier ${filename}`);

    // Utilisation de l'adaptateur fourni pour ouvrir le fichier
    return imageAdapter.loadImage(filename);
  }

  editImage(image) {
    if (!image) {
      console.error("Impossible d'éditer une image non valide");
      return;
    }
    console.log(
      `Édition de l'image ${image.filename} (${image.width}x${image.height})`
    );
    // Simulation d'opérations d'édition
    console.log(
      'Opérations disponibles: rogner, redimensionner, appliquer des filtres...'
    );
  }

  saveFile(image, newFilename, imageAdapter) {
    if (!image) {
      console.error('Impossible de sauvegarder une image non valide');
      return false;
    }
    return imageAdapter.saveImage(image, newFilename);
  }

  displaySupportedFormats(adapters) {
    const formats = adapters
      .map((adapter) => adapter.getSupportedFormats())
      .flat();
    console.log(`Formats supportés: ${formats.join(', ')}`);
  }
}

// Interface de l'adaptateur d'images
class ImageAdapter {
  loadImage(filename) {
    throw new Error(
      'La méthode loadImage doit être implémentée par les sous-classes'
    );
  }

  saveImage(image, filename) {
    throw new Error(
      'La méthode saveImage doit être implémentée par les sous-classes'
    );
  }

  getSupportedFormats() {
    throw new Error(
      'La méthode getSupportedFormats doit être implémentée par les sous-classes'
    );
  }
}

// Adaptateur pour les images PNG (adaptateur concret)
class PngAdapter extends ImageAdapter {
  constructor() {
    super();
    console.log('Adaptateur PNG initialisé');
  }

  loadImage(filename) {
    if (!filename.toLowerCase().endsWith('.png')) {
      console.error("Ce n'est pas un fichier PNG");
      return null;
    }

    console.log(`Chargement du fichier PNG: ${filename}`);
    // Simulation du chargement de l'image PNG
    return new Image(
      filename,
      'PNG',
      1024,
      768,
      `Données simulées de l'image ${filename}`
    );
  }

  saveImage(image, filename) {
    const newFilename = filename.toLowerCase().endsWith('.png')
      ? filename
      : `${filename}.png`;
    console.log(`Sauvegarde de l'image au format PNG: ${newFilename}`);
    return true;
  }

  getSupportedFormats() {
    return ['PNG'];
  }
}

// Adaptateur pour les images JPEG (adapte la bibliothèque JpegProcessor)
class JpegAdapter extends ImageAdapter {
  constructor() {
    super();
    this.processor = new JpegProcessor();
    console.log('Adaptateur JPEG initialisé');
  }

  loadImage(filename) {
    if (
      !filename.toLowerCase().endsWith('.jpg') &&
      !filename.toLowerCase().endsWith('.jpeg')
    ) {
      console.error("Ce n'est pas un fichier JPEG");
      return null;
    }

    // Utilisation de la bibliothèque existante pour charger l'image
    const jpegImage = this.processor.loadJpegImage(filename);

    // Conversion au format attendu par l'éditeur
    return new Image(
      jpegImage.jpegFilename,
      'JPEG',
      jpegImage.width,
      jpegImage.height,
      jpegImage.jpegData
    );
  }

  saveImage(image, filename) {
    // Adaptation pour utiliser la méthode de sauvegarde de JpegProcessor
    const newFilename = this.ensureJpegExtension(filename);

    // Conversion du format interne vers le format attendu par JpegProcessor
    const jpegImage = {
      jpegFilename: image.filename,
      jpegData: image.data,
      width: image.width,
      height: image.height,
      resolution: '72dpi', // Valeur par défaut
    };

    return this.processor.saveAsJpeg(jpegImage, newFilename);
  }

  getSupportedFormats() {
    return ['JPG', 'JPEG'];
  }

  // Méthode utilitaire pour s'assurer que le fichier a une extension JPEG
  ensureJpegExtension(filename) {
    if (
      filename.toLowerCase().endsWith('.jpg') ||
      filename.toLowerCase().endsWith('.jpeg')
    ) {
      return filename;
    }
    return `${filename}.jpg`;
  }
}

// Adaptateur pour les images GIF (adapte la bibliothèque GifProcessor)
class GifAdapter extends ImageAdapter {
  constructor() {
    super();
    this.processor = new GifProcessor();
    console.log('Adaptateur GIF initialisé');
  }

  loadImage(filename) {
    if (!filename.toLowerCase().endsWith('.gif')) {
      console.error("Ce n'est pas un fichier GIF");
      return null;
    }

    // Utilisation de la bibliothèque existante pour charger l'image
    const gifImage = this.processor.readGifFile(filename);
    const metadata = this.processor.extractGifMetadata(gifImage);

    // Conversion au format attendu par l'éditeur
    return new Image(
      gifImage.name,
      'GIF',
      metadata.width,
      metadata.height,
      gifImage.gifData
    );
  }

  saveImage(image, filename) {
    // Adaptation pour utiliser la méthode de sauvegarde de GifProcessor
    const newFilename = filename.toLowerCase().endsWith('.gif')
      ? filename
      : `${filename}.gif`;

    // Conversion du format interne vers le format attendu par GifProcessor
    const gifImage = {
      name: image.filename,
      gifData: image.data,
      frameCount: 1, // Valeur par défaut pour une image statique
      animationSpeed: '0ms', // Pas d'animation par défaut
      dimensions: { x: image.width, y: image.height },
    };

    const result = this.processor.writeGif(gifImage, newFilename);
    return result.success;
  }

  getSupportedFormats() {
    return ['GIF'];
  }
}

// Classes existantes (inchangées)
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

// Factory pour créer le bon adaptateur en fonction de l'extension du fichier
class ImageAdapterFactory {
  static getAdapter(filename) {
    const extension = filename.split('.').pop().toLowerCase();

    switch (extension) {
      case 'png':
        return new PngAdapter();
      case 'jpg':
      case 'jpeg':
        return new JpegAdapter();
      case 'gif':
        return new GifAdapter();
      default:
        console.error(`Format non supporté: ${extension}`);
        return null;
    }
  }

  static getAllAdapters() {
    return [new PngAdapter(), new JpegAdapter(), new GifAdapter()];
  }
}

// Utilisation (avec adapter)
console.log('=== UTILISATION AVEC PATTERN ADAPTER ===\n');

// Création de l'éditeur d'images
const editor = new ImageEditor();

// Afficher tous les formats supportés
editor.displaySupportedFormats(ImageAdapterFactory.getAllAdapters());

// Fichiers à ouvrir
const pngFile = 'image1.png';
const jpegFile = 'photo.jpeg';
const gifFile = 'animation.gif';

console.log("\n--- Ouverture d'un fichier PNG ---");
const pngAdapter = ImageAdapterFactory.getAdapter(pngFile);
const image1 = editor.openFile(pngFile, pngAdapter);
editor.editImage(image1);
editor.saveFile(image1, 'image1_edited.png', pngAdapter);

console.log("\n--- Ouverture d'un fichier JPEG ---");
const jpegAdapter = ImageAdapterFactory.getAdapter(jpegFile);
const image2 = editor.openFile(jpegFile, jpegAdapter);
editor.editImage(image2);
editor.saveFile(image2, 'photo_modifiee', jpegAdapter); // L'extension sera ajoutée automatiquement

console.log("\n--- Ouverture d'un fichier GIF ---");
const gifAdapter = ImageAdapterFactory.getAdapter(gifFile);
const image3 = editor.openFile(gifFile, gifAdapter);
editor.editImage(image3);
editor.saveFile(image3, 'animation_modifiee.gif', gifAdapter);

// Version simplifiée avec factory automatique
console.log('\n=== UTILISATION SIMPLIFIÉE AVEC FACTORY ===\n');

function openAndEditImage(editor, filename) {
  const adapter = ImageAdapterFactory.getAdapter(filename);
  if (!adapter) return;

  const image = editor.openFile(filename, adapter);
  if (image) {
    editor.editImage(image);
    const newFilename = filename.replace('.', '_edited.');
    editor.saveFile(image, newFilename, adapter);
  }
}

openAndEditImage(editor, 'landscape.png');
openAndEditImage(editor, 'portrait.jpg');
openAndEditImage(editor, 'banner.gif');

console.log('\n=== AVANTAGES DU PATTERN ADAPTER ===');
console.log("1. Interface unifiée pour tous les formats d'images");
console.log(
  '2. Ajout facile de nouveaux formats sans modifier le code existant'
);
console.log(
  '3. Réutilisation des bibliothèques existantes (JpegProcessor, GifProcessor)'
);
console.log(
  "4. L'éditeur d'images n'a pas besoin de connaître les détails des différents formats"
);
console.log('5. Séparation claire des responsabilités');
