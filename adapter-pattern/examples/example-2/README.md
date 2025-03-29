# Pattern Adapter - Bibliothèque de conversion de formats d'images

## Le problème

Dans le développement logiciel, nous sommes souvent confrontés à des situations où nous devons intégrer des bibliothèques existantes ou des composants tiers qui ont des interfaces incompatibles avec notre code. Ce problème est particulièrement courant dans les applications de traitement d'images qui doivent gérer plusieurs formats (PNG, JPEG, GIF, etc.).

Dans notre exemple, nous avons un éditeur d'images qui ne supporte nativement que le format PNG, mais nous souhaitons qu'il puisse manipuler également des fichiers JPEG et GIF. Le défi est que nous disposons déjà de bibliothèques spécialisées pour traiter ces formats, mais elles utilisent des interfaces différentes:

- `JpegProcessor` - Bibliothèque pour les images JPEG avec ses méthodes spécifiques
- `GifProcessor` - Bibliothèque pour les images GIF avec une interface totalement différente

Sans pattern de conception adapté, nous devrions modifier notre éditeur d'images pour prendre en charge explicitement chaque format, ce qui violerait le principe ouvert/fermé et rendrait notre code difficile à maintenir.

## La solution : Pattern Adapter

Le Pattern Adapter nous permet de convertir l'interface d'une classe existante en une autre interface que notre client (l'éditeur d'images) attend. Il agit comme un "traducteur" entre des interfaces incompatibles, permettant à des classes de travailler ensemble sans modification de leur code source.

## Structure de l'exemple

### L'implémentation de base (sans Adapter)

Dans l'implémentation sans le Pattern Adapter (`basicCode.js`), notre `ImageEditor` :

1. Ne supporte que le format PNG nativement
2. Ne peut pas utiliser directement les classes `JpegProcessor` et `GifProcessor`
3. Nécessite un traitement manuel et spécifique pour chaque format

```javascript
// Classe cliente avec support limité
class ImageEditor {
  constructor() {
    this.supportedFormats = ['PNG'];
  }

  openFile(filename) {
    const extension = filename.split('.').pop().toUpperCase();

    if (this.supportedFormats.includes(extension)) {
      // Traitement des fichiers PNG uniquement
    } else {
      console.error(`Format non supporté: ${extension}`);
      return null;
    }
  }
}

// Utilisation manuelle des différentes bibliothèques
const jpegProcessor = new JpegProcessor();
const jpegImage = jpegProcessor.loadJpegImage(jpegFile);
// Code spécifique pour manipuler l'image JPEG...

const gifProcessor = new GifProcessor();
const gifImage = gifProcessor.readGifFile(gifFile);
// Code spécifique pour manipuler l'image GIF...
```

### L'implémentation avec le Pattern Adapter

Dans l'implémentation refactorisée (`refactorCode.js`), nous avons :

1. Une interface commune (`ImageAdapter`) que tous les adaptateurs doivent implémenter
2. Des adaptateurs spécifiques pour chaque format d'image (PNG, JPEG, GIF)
3. Une classe `ImageEditor` qui travaille uniquement avec l'interface commune

#### La structure du code

```
Image (classe cible)
  ^
  |
ImageAdapter (interface d'adaptateur)
  ^
  |
  +-- PngAdapter (adaptateur concret)
  |
  +-- JpegAdapter (adaptateur concret) --> JpegProcessor (classe existante)
  |
  +-- GifAdapter (adaptateur concret) --> GifProcessor (classe existante)
```

#### Interface commune

```javascript
class ImageAdapter {
  loadImage(filename) {
    /* ... */
  }
  saveImage(image, filename) {
    /* ... */
  }
  getSupportedFormats() {
    /* ... */
  }
}
```

#### Adaptateur JPEG (exemple)

```javascript
class JpegAdapter extends ImageAdapter {
  constructor() {
    super();
    this.processor = new JpegProcessor();
  }

  loadImage(filename) {
    // Utilise JpegProcessor mais retourne un objet au format standard
    const jpegImage = this.processor.loadJpegImage(filename);
    return new Image(
      jpegImage.jpegFilename,
      'JPEG',
      jpegImage.width,
      jpegImage.height,
      jpegImage.jpegData
    );
  }

  // Autres méthodes adaptées...
}
```

### Utilisation simplifiée

```javascript
// Création de l'éditeur
const editor = new ImageEditor();

// Factory pour obtenir l'adaptateur approprié
const adapter = ImageAdapterFactory.getAdapter(filename);

// Ouverture et édition de l'image (quelle que soit son format)
const image = editor.openFile(filename, adapter);
editor.editImage(image);
editor.saveFile(image, newFilename, adapter);
```

## Avantages du Pattern Adapter

1. **Interface unifiée** - Tous les formats d'images sont manipulés de la même manière
2. **Extension facile** - Ajouter un nouveau format d'image se fait en créant simplement un nouvel adaptateur
3. **Réutilisation** - Nous pouvons continuer à utiliser les bibliothèques existantes sans les modifier
4. **Séparation des préoccupations** - L'éditeur d'images n'a pas besoin de connaître les détails de chaque format
5. **Principe ouvert/fermé** - Le code existant n'a pas besoin d'être modifié pour ajouter de nouveaux formats

## Bonnes pratiques illustrées

1. **Composition plutôt qu'héritage** - Les adaptateurs utilisent la composition pour réutiliser les bibliothèques existantes
2. **Programming to an interface** - L'éditeur interagit uniquement avec l'interface `ImageAdapter`
3. **Factory Method** - Utilisation d'une factory pour instancier le bon adaptateur

## Applications réelles

Le Pattern Adapter est largement utilisé dans les bibliothèques de traitement d'images et les logiciels graphiques :

- Bibliothèques comme ImageMagick qui supportent de nombreux formats d'images
- Éditeurs graphiques comme GIMP ou Photoshop qui peuvent ouvrir et enregistrer dans différents formats
- Frameworks comme Sharp (Node.js) ou Pillow (Python) qui offrent une API unifiée pour manipuler différents formats d'images

Ce pattern est également essentiel pour l'intégration de services tiers, les connecteurs de bases de données, et les couches d'abstraction dans les applications modernes.
