// Implémentation sans le Facade Pattern
// Exemple d'un système de home cinéma complexe

// Sous-système: Amplificateur
class Amplifier {
  constructor() {
    this.volume = 0;
    this.source = null;
  }

  on() {
    console.log('Amplificateur allumé');
  }

  off() {
    console.log('Amplificateur éteint');
  }

  setVolume(level) {
    this.volume = level;
    console.log(`Volume réglé à ${level}`);
  }

  setSource(source) {
    this.source = source;
    console.log(`Source réglée sur ${source}`);
  }
}

// Sous-système: Lecteur DVD
class DvdPlayer {
  constructor() {
    this.movie = null;
    this.isPlaying = false;
  }

  on() {
    console.log('Lecteur DVD allumé');
  }

  off() {
    console.log('Lecteur DVD éteint');
  }

  play(movie) {
    this.movie = movie;
    this.isPlaying = true;
    console.log(`Lecture du film "${movie}"`);
  }

  stop() {
    this.isPlaying = false;
    console.log('Lecture arrêtée');
  }

  eject() {
    this.movie = null;
    console.log('DVD éjecté');
  }
}

// Sous-système: Projecteur
class Projector {
  constructor() {
    this.input = null;
  }

  on() {
    console.log('Projecteur allumé');
  }

  off() {
    console.log('Projecteur éteint');
  }

  setInput(input) {
    this.input = input;
    console.log(`Entrée du projecteur réglée sur ${input}`);
  }

  setMode(mode) {
    console.log(`Mode du projecteur réglé sur ${mode}`);
  }
}

// Sous-système: Éclairage
class Lights {
  constructor() {
    this.brightness = 100;
  }

  on() {
    console.log('Lumières allumées');
  }

  off() {
    console.log('Lumières éteintes');
  }

  dim(level) {
    this.brightness = level;
    console.log(`Luminosité réglée à ${level}%`);
  }
}

// Sous-système: Écran
class Screen {
  down() {
    console.log('Écran abaissé');
  }

  up() {
    console.log('Écran remonté');
  }
}

// Sous-système: Son surround
class SurroundSound {
  on() {
    console.log('Son surround activé');
  }

  off() {
    console.log('Son surround désactivé');
  }

  setVolume(level) {
    console.log(`Volume du son surround réglé à ${level}`);
  }

  setMode(mode) {
    console.log(`Mode du son surround réglé sur ${mode}`);
  }
}

// Utilisation sans Facade (complexe et verbeuse)
console.log('Préparation du home cinéma pour regarder un film:');

// Étape 1: Préparer la pièce
const lights = new Lights();
lights.dim(10);

const screen = new Screen();
screen.down();

// Étape 2: Allumer les appareils
const projector = new Projector();
projector.on();
projector.setInput('DVD');
projector.setMode('Mode Cinéma');

const amp = new Amplifier();
amp.on();
amp.setSource('DVD');
amp.setVolume(20);

const sound = new SurroundSound();
sound.on();
sound.setMode('Dolby Digital');
sound.setVolume(20);

const dvdPlayer = new DvdPlayer();
dvdPlayer.on();

// Étape 3: Lancer la lecture
dvdPlayer.play('Inception');

// Ici, pour éteindre le système, nous devrions faire l'inverse
// dans un ordre précis, ce qui est tout aussi complexe...

// Problèmes:
// 1. Code client très verbeux et compliqué
// 2. Le client doit connaître tous les composants et leur ordre d'initialisation
// 3. Tout changement dans les composants peut affecter le code client
