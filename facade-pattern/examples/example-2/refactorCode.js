// Implémentation avec le Pattern Facade
// Exemple: Système de traitement vidéo

// Sous-système: Classes qui effectuent le travail réel

// Classe pour gérer les fichiers vidéo
class VideoFile {
  constructor(filename) {
    this.filename = filename;
    this.format = this.getFileFormat(filename);
    this.data = this.loadFile(filename);
  }

  getFileFormat(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
  }

  loadFile(filename) {
    console.log(`Chargement du fichier vidéo: ${filename}`);
    // Dans un cas réel, nous chargerions le contenu du fichier
    return `Contenu simulé de ${filename}`;
  }

  save(filename) {
    console.log(`Sauvegarde du fichier vidéo sous: ${filename}`);
    return true;
  }
}

// Classe pour le codec vidéo
class VideoCodec {
  constructor(type) {
    this.type = type;
  }

  static createCodec(format) {
    if (format === 'mp4') return new MPEG4Codec();
    if (format === 'avi') return new AVICodec();
    if (format === 'mov') return new MOVCodec();
    if (format === 'mkv') return new MKVCodec();
    throw new Error(`Format non supporté: ${format}`);
  }
}

class MPEG4Codec extends VideoCodec {
  constructor() {
    super('mpeg4');
    console.log('Initialisation du codec MPEG-4');
  }

  decode(videoData) {
    console.log('Décodage des données vidéo MPEG-4');
    return `Données MPEG-4 décodées: ${videoData}`;
  }

  encode(videoData) {
    console.log('Encodage des données vidéo en MPEG-4');
    return `Données encodées en MPEG-4: ${videoData}`;
  }
}

class AVICodec extends VideoCodec {
  constructor() {
    super('avi');
    console.log('Initialisation du codec AVI');
  }

  decode(videoData) {
    console.log('Décodage des données vidéo AVI');
    return `Données AVI décodées: ${videoData}`;
  }

  encode(videoData) {
    console.log('Encodage des données vidéo en AVI');
    return `Données encodées en AVI: ${videoData}`;
  }
}

class MOVCodec extends VideoCodec {
  constructor() {
    super('mov');
    console.log('Initialisation du codec MOV');
  }

  decode(videoData) {
    console.log('Décodage des données vidéo MOV');
    return `Données MOV décodées: ${videoData}`;
  }

  encode(videoData) {
    console.log('Encodage des données vidéo en MOV');
    return `Données encodées en MOV: ${videoData}`;
  }
}

class MKVCodec extends VideoCodec {
  constructor() {
    super('mkv');
    console.log('Initialisation du codec MKV');
  }

  decode(videoData) {
    console.log('Décodage des données vidéo MKV');
    return `Données MKV décodées: ${videoData}`;
  }

  encode(videoData) {
    console.log('Encodage des données vidéo en MKV');
    return `Données encodées en MKV: ${videoData}`;
  }
}

// Classe pour les filtres vidéo
class VideoFilter {
  static applyFilter(videoData, filterType) {
    console.log(`Application du filtre: ${filterType}`);
    return `${videoData} (avec filtre ${filterType})`;
  }
}

// Classe pour le redimensionnement vidéo
class VideoResizer {
  static resize(videoData, width, height) {
    console.log(`Redimensionnement de la vidéo à ${width}x${height}`);
    return `${videoData} (redimensionné à ${width}x${height})`;
  }
}

// Classe pour la compression vidéo
class VideoCompressor {
  static compress(videoData, level) {
    console.log(`Compression de la vidéo au niveau: ${level}`);
    return `${videoData} (compressé au niveau ${level})`;
  }
}

// Classe pour l'audio
class AudioProcessor {
  static extractAudio(videoData) {
    console.log('Extraction de la piste audio');
    return `Piste audio extraite de: ${videoData}`;
  }

  static mixAudio(videoData, audioTrack) {
    console.log(`Mixage de la piste audio: ${audioTrack}`);
    return `${videoData} (avec audio mixé: ${audioTrack})`;
  }

  static normalizeVolume(audioData) {
    console.log('Normalisation du volume audio');
    return `${audioData} (volume normalisé)`;
  }
}

// Classe pour les métadonnées vidéo
class VideoMetadata {
  static addMetadata(videoData, metadata) {
    console.log('Ajout des métadonnées à la vidéo:', metadata);
    return `${videoData} (avec métadonnées)`;
  }

  static readMetadata(videoData) {
    console.log('Lecture des métadonnées de la vidéo');
    return { title: 'Vidéo test', author: 'Utilisateur', date: new Date() };
  }
}

// FACADE - Interface simplifiée pour le système complexe
class VideoConverterFacade {
  constructor() {
    // Le constructeur peut initialiser des configurations communes
    console.log('Initialisation du convertisseur vidéo');
  }

  // Méthode principale de la façade pour convertir une vidéo d'un format à un autre
  convertVideo(sourceFilename, targetFormat, options = {}) {
    console.log(
      `\nDémarrage de la conversion de ${sourceFilename} vers le format ${targetFormat}`
    );

    // Valeurs par défaut pour les options
    const defaultOptions = {
      width: 1920,
      height: 1080,
      compressionLevel: 8,
      applyFilter: null,
      normalizeAudio: true,
      metadata: {},
    };

    // Fusion des options par défaut avec les options fournies
    const settings = { ...defaultOptions, ...options };

    try {
      // 1. Charger le fichier source
      const sourceFile = new VideoFile(sourceFilename);

      // 2. Déterminer le format cible et générer le nom du fichier de sortie
      const targetExtension = targetFormat.toLowerCase();
      const targetFilename = this._generateOutputFilename(
        sourceFilename,
        targetExtension
      );

      // 3. Créer les codecs nécessaires
      const sourceCodec = VideoCodec.createCodec(sourceFile.format);
      const targetCodec = VideoCodec.createCodec(targetExtension);

      // 4. Décodage des données source
      let videoData = sourceCodec.decode(sourceFile.data);

      // 5. Traitement de la vidéo selon les options

      // Redimensionnement si nécessaire
      if (settings.width && settings.height) {
        videoData = VideoResizer.resize(
          videoData,
          settings.width,
          settings.height
        );
      }

      // Application de filtre si spécifié
      if (settings.applyFilter) {
        videoData = VideoFilter.applyFilter(videoData, settings.applyFilter);
      }

      // Compression
      videoData = VideoCompressor.compress(
        videoData,
        settings.compressionLevel
      );

      // 6. Traitement audio
      const audioData = AudioProcessor.extractAudio(videoData);

      // Normalisation du volume si demandée
      const processedAudio = settings.normalizeAudio
        ? AudioProcessor.normalizeVolume(audioData)
        : audioData;

      // Mixage de l'audio avec la vidéo
      videoData = AudioProcessor.mixAudio(videoData, processedAudio);

      // 7. Encodage avec le codec cible
      videoData = targetCodec.encode(videoData);

      // 8. Ajout des métadonnées
      if (Object.keys(settings.metadata).length > 0) {
        videoData = VideoMetadata.addMetadata(videoData, settings.metadata);
      }

      // 9. Sauvegarde du fichier
      const targetFile = new VideoFile(targetFilename);
      targetFile.data = videoData;
      targetFile.save(targetFilename);

      console.log(
        `\nConversion terminée avec succès! Fichier sauvegardé sous: ${targetFilename}`
      );
      return targetFilename;
    } catch (error) {
      console.error(`Erreur lors de la conversion: ${error.message}`);
      throw error;
    }
  }

  // Méthode façade spécifique pour appliquer un filtre
  applyFilterToVideo(filename, filterType) {
    console.log(
      `\nApplication du filtre "${filterType}" au fichier ${filename}`
    );

    try {
      // 1. Charger le fichier
      const file = new VideoFile(filename);

      // 2. Créer le codec
      const codec = VideoCodec.createCodec(file.format);

      // 3. Décodage
      const videoData = codec.decode(file.data);

      // 4. Application du filtre
      const filteredData = VideoFilter.applyFilter(videoData, filterType);

      // 5. Encodage
      const encodedData = codec.encode(filteredData);

      // 6. Générer le nom du fichier de sortie
      const outputFilename = this._generateFilteredFilename(
        filename,
        filterType
      );

      // 7. Sauvegarde
      file.data = encodedData;
      file.save(outputFilename);

      console.log(
        `\nFiltre appliqué avec succès! Fichier sauvegardé sous: ${outputFilename}`
      );
      return outputFilename;
    } catch (error) {
      console.error(`Erreur lors de l'application du filtre: ${error.message}`);
      throw error;
    }
  }

  // Méthode façade pour extraire l'audio d'une vidéo
  extractAudioFromVideo(filename) {
    console.log(`\nExtraction de l'audio du fichier ${filename}`);

    try {
      // 1. Charger le fichier
      const file = new VideoFile(filename);

      // 2. Créer le codec
      const codec = VideoCodec.createCodec(file.format);

      // 3. Décodage
      const videoData = codec.decode(file.data);

      // 4. Extraction de l'audio
      const audioData = AudioProcessor.extractAudio(videoData);

      // 5. Normalisation du volume
      const normalizedAudio = AudioProcessor.normalizeVolume(audioData);

      // 6. Générer le nom du fichier audio
      const outputFilename = filename.replace(/\.[^/.]+$/, '.mp3');

      console.log(
        `\nAudio extrait avec succès! Fichier audio: ${outputFilename}`
      );
      return normalizedAudio;
    } catch (error) {
      console.error(`Erreur lors de l'extraction audio: ${error.message}`);
      throw error;
    }
  }

  // Méthode utilitaire privée pour générer un nom de fichier de sortie
  _generateOutputFilename(sourceFilename, targetExtension) {
    const baseName = sourceFilename.split('.')[0];
    return `${baseName}_converted.${targetExtension}`;
  }

  // Méthode utilitaire privée pour générer un nom de fichier filtré
  _generateFilteredFilename(filename, filterType) {
    const parts = filename.split('.');
    const extension = parts.pop();
    const baseName = parts.join('.');
    const safeFilterName = filterType.replace(/\s+/g, '_').toLowerCase();
    return `${baseName}_${safeFilterName}.${extension}`;
  }
}

// Utilisation du système avec Pattern Facade
console.log(
  '=== UTILISATION DU SYSTÈME DE TRAITEMENT VIDÉO AVEC PATTERN FACADE ===\n'
);

// Création de la façade
const videoConverter = new VideoConverterFacade();

// Exemple 1: Convertir une vidéo avec plusieurs options
videoConverter.convertVideo('source.avi', 'mp4', {
  width: 1280,
  height: 720,
  compressionLevel: 7,
  applyFilter: 'amélioration',
  metadata: {
    title: 'Ma vidéo convertie',
    author: 'Claude',
    description: 'Vidéo convertie avec le Pattern Facade',
  },
});

// Exemple 2: Appliquer simplement un filtre
videoConverter.applyFilterToVideo('vacation.mp4', 'sépia');

// Exemple 3: Extraire l'audio d'une vidéo
videoConverter.extractAudioFromVideo('concert.mov');

// Avantages du Pattern Facade
console.log('\n=== AVANTAGES DU PATTERN FACADE ===');
console.log(
  '1. Interface simplifiée - Une seule classe avec des méthodes intuitives cache la complexité du système'
);
console.log(
  '2. Découplage - Le code client ne dépend que de la façade, pas des détails du sous-système'
);
console.log(
  "3. Encapsulation - Les détails d'implémentation sont encapsulés dans la façade"
);
console.log(
  "4. Facilité de maintenance - Les modifications dans le sous-système n'affectent pas le code client"
);
console.log(
  '5. Organisation - Le code est mieux organisé avec des opérations regroupées logiquement'
);
