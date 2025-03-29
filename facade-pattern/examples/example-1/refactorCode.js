// Implémentation avec le Facade Pattern
// Exemple d'un système de home cinéma complexe

// Les classes de sous-système restent les mêmes
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

// FACADE: Une interface simplifiée au système complexe
class HomeCinemaFacade {
  constructor() {
    // Initialisation de tous les sous-systèmes
    this.amplifier = new Amplifier();
    this.dvdPlayer = new DvdPlayer();
    this.projector = new Projector();
    this.lights = new Lights();
    this.screen = new Screen();
    this.surroundSound = new SurroundSound();
  }

  // Méthode simplifiée pour regarder un film
  watchMovie(movie) {
    console.log('\n=== Préparation du home cinéma via la FACADE ===');
    console.log(`Préparation pour regarder "${movie}"...`);

    // La séquence complexe est encapsulée dans la façade
    this.lights.dim(10);
    this.screen.down();
    this.projector.on();
    this.projector.setInput('DVD');
    this.projector.setMode('Mode Cinéma');
    this.amplifier.on();
    this.amplifier.setSource('DVD');
    this.amplifier.setVolume(20);
    this.surroundSound.on();
    this.surroundSound.setMode('Dolby Digital');
    this.surroundSound.setVolume(20);
    this.dvdPlayer.on();
    this.dvdPlayer.play(movie);

    console.log('Configuration terminée. Bon film!');
  }

  // Méthode simplifiée pour arrêter le film
  endMovie() {
    console.log('\n=== Arrêt du home cinéma via la FACADE ===');
    console.log('Arrêt du système home cinéma...');

    // La séquence complexe d'arrêt est également encapsulée
    this.dvdPlayer.stop();
    this.dvdPlayer.eject();
    this.dvdPlayer.off();
    this.amplifier.off();
    this.surroundSound.off();
    this.projector.off();
    this.screen.up();
    this.lights.on();

    console.log('Système home cinéma arrêté avec succès.');
  }

  // On pourrait ajouter d'autres méthodes simplifiées
  listenToMusic(album) {
    console.log(`\nConfiguration pour écouter l'album "${album}"...`);
    // ... configuration pour la musique
  }

  playGame(game) {
    console.log(`\nConfiguration pour jouer à "${game}"...`);
    // ... configuration pour les jeux
  }
}

// Utilisation avec le Facade Pattern (beaucoup plus simple)
const homeCinema = new HomeCinemaFacade();

// Pour regarder un film, une seule ligne suffit
homeCinema.watchMovie('Inception');

// Simulation du temps qui passe pendant que le film est regardé
console.log('\n[Le film se joue...]\n');

// Pour arrêter le film, également une seule ligne
homeCinema.endMovie();

// La façade peut être étendue avec d'autres fonctionnalités simples
// homeCinema.listenToMusic("Abbey Road");
// homeCinema.playGame("FIFA 2023");
