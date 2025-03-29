// Implémentation sans le Pattern Facade
// Exemple: Système de traitement vidéo

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

// Utilisation du système sans Pattern Facade
console.log(
  '=== UTILISATION DU SYSTÈME DE TRAITEMENT VIDÉO SANS PATTERN FACADE ===\n'
);

// Exemple 1: Convertir un fichier vidéo de AVI en MP4
const convertAVItoMP4 = () => {
  console.log('--- Conversion AVI en MP4 ---');

  // Chargement du fichier source
  const sourceFile = new VideoFile('source.avi');

  // Création des codecs
  const sourceCodec = VideoCodec.createCodec(sourceFile.format);
  const targetCodec = VideoCodec.createCodec('mp4');

  // Décodage avec le codec source
  const decodedData = sourceCodec.decode(sourceFile.data);

  // Application de traitements
  const resizedData = VideoResizer.resize(decodedData, 1920, 1080);
  const filteredData = VideoFilter.applyFilter(resizedData, 'amélioration');
  const compressedData = VideoCompressor.compress(filteredData, 8);

  // Traitement audio
  const extractedAudio = AudioProcessor.extractAudio(decodedData);
  const normalizedAudio = AudioProcessor.normalizeVolume(extractedAudio);
  const dataWithAudio = AudioProcessor.mixAudio(
    compressedData,
    normalizedAudio
  );

  // Encodage avec le codec cible
  const encodedData = targetCodec.encode(dataWithAudio);

  // Ajout de métadonnées
  const finalData = VideoMetadata.addMetadata(encodedData, {
    title: 'Vidéo convertie',
    author: 'Convertisseur',
  });

  // Création du fichier de destination
  const targetFile = new VideoFile('output.mp4');

  // Enregistrement du fichier
  targetFile.data = finalData;
  targetFile.save('output.mp4');

  console.log('\nConversion terminée avec succès!');
};

// Exemple 2: Appliquer un filtre à une vidéo MP4
const applyFilterToMP4 = () => {
  console.log("\n--- Application d'un filtre à un fichier MP4 ---");

  // Chargement du fichier
  const file = new VideoFile('video.mp4');

  // Création du codec
  const codec = VideoCodec.createCodec(file.format);

  // Décodage
  const decodedData = codec.decode(file.data);

  // Application du filtre
  const filteredData = VideoFilter.applyFilter(decodedData, 'noir et blanc');

  // Encodage
  const encodedData = codec.encode(filteredData);

  // Enregistrement
  file.data = encodedData;
  file.save('video_filtered.mp4');

  console.log('\nFiltre appliqué avec succès!');
};

// Exécution des exemples
convertAVItoMP4();
applyFilterToMP4();

// Problèmes avec cette approche:
console.log('\n=== PROBLÈMES AVEC CETTE APPROCHE ===');
console.log(
  "1. Complexité d'utilisation - Le client doit connaître de nombreuses classes et leurs interactions"
);
console.log(
  '2. Couplage fort - Le code client est fortement couplé à toutes les classes du sous-système'
);
console.log(
  '3. Duplication de code - Plusieurs opérations communes doivent être répétées à chaque utilisation'
);
console.log(
  '4. Difficile à maintenir - Un changement dans une des classes peut nécessiter des mises à jour dans tout le code client'
);
console.log(
  "5. Procédures complexes - Les séquences d'opérations sont complexes et dispersées"
);
