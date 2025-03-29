// Implémentation sans l'Iterator Pattern
// Exemple avec différentes structures de données pour stocker des musiques

// Playlist utilisant un tableau pour stocker les chansons
class ArrayPlaylist {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }

  // Méthode spécifique pour parcourir un tableau
  displaySongs() {
    console.log(`\nListe des chansons de la playlist "${this.name}" (Array):`);
    for (let i = 0; i < this.songs.length; i++) {
      console.log(`${i + 1}. ${this.songs[i]}`);
    }
  }
}

// Playlist utilisant un ensemble (Set) pour stocker les chansons uniques
class SetPlaylist {
  constructor(name) {
    this.name = name;
    this.songs = new Set();
  }

  addSong(song) {
    this.songs.add(song);
  }

  // Méthode spécifique pour parcourir un Set (différente de la méthode pour Array)
  displaySongs() {
    console.log(`\nListe des chansons de la playlist "${this.name}" (Set):`);
    let index = 1;
    this.songs.forEach((song) => {
      console.log(`${index++}. ${song}`);
    });
  }
}

// Playlist utilisant un objet Map pour associer un ID à chaque chanson
class MapPlaylist {
  constructor(name) {
    this.name = name;
    this.songs = new Map();
    this.nextId = 1;
  }

  addSong(song) {
    this.songs.set(this.nextId++, song);
  }

  // Méthode spécifique pour parcourir un Map (encore différente)
  displaySongs() {
    console.log(`\nListe des chansons de la playlist "${this.name}" (Map):`);
    this.songs.forEach((song, id) => {
      console.log(`${id}. ${song}`);
    });
  }
}

// Utilisation (problématique)
// Création d'une playlist avec un tableau
const rockPlaylist = new ArrayPlaylist('Rock Classics');
rockPlaylist.addSong('Queen - Bohemian Rhapsody');
rockPlaylist.addSong('Led Zeppelin - Stairway to Heaven');
rockPlaylist.addSong('AC/DC - Highway to Hell');

// Affichage des chansons avec la méthode spécifique à ArrayPlaylist
rockPlaylist.displaySongs();

// Création d'une playlist avec un Set
const jazzPlaylist = new SetPlaylist('Jazz Favorites');
jazzPlaylist.addSong('Miles Davis - So What');
jazzPlaylist.addSong('John Coltrane - Giant Steps');
jazzPlaylist.addSong('Dave Brubeck - Take Five');

// Affichage des chansons avec la méthode spécifique à SetPlaylist
jazzPlaylist.displaySongs();

// Création d'une playlist avec un Map
const popPlaylist = new MapPlaylist('Pop Hits');
popPlaylist.addSong('Michael Jackson - Billie Jean');
popPlaylist.addSong('Madonna - Like a Prayer');
popPlaylist.addSong('Prince - Purple Rain');

// Affichage des chansons avec la méthode spécifique à MapPlaylist
popPlaylist.displaySongs();

// Problèmes:
// 1. Chaque classe de collection a sa propre méthode de parcours (displaySongs)
// 2. Le client doit connaître le type de collection pour savoir comment la parcourir
// 3. Si on veut parcourir les collections d'une autre manière, on doit ajouter d'autres méthodes
// 4. Difficile d'uniformiser le traitement des différentes collections
