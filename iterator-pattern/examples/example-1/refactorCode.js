// Implémentation avec l'Iterator Pattern
// Exemple avec différentes structures de données pour stocker des musiques

// Interface commune d'itérateur (abstraite)
class Iterator {
  hasNext() {
    throw new Error('La méthode hasNext doit être implémentée');
  }

  next() {
    throw new Error('La méthode next doit être implémentée');
  }
}

// Interface commune pour les collections (abstraite)
class Collection {
  createIterator() {
    throw new Error('La méthode createIterator doit être implémentée');
  }
}

// Implémentation concrète d'un itérateur pour un tableau
class ArrayIterator extends Iterator {
  constructor(items) {
    super();
    this.items = items;
    this.position = 0;
  }

  hasNext() {
    return this.position < this.items.length;
  }

  next() {
    return this.hasNext() ? this.items[this.position++] : null;
  }
}

// Implémentation concrète d'un itérateur pour un Set
class SetIterator extends Iterator {
  constructor(set) {
    super();
    this.items = Array.from(set);
    this.position = 0;
  }

  hasNext() {
    return this.position < this.items.length;
  }

  next() {
    return this.hasNext() ? this.items[this.position++] : null;
  }
}

// Implémentation concrète d'un itérateur pour un Map
class MapIterator extends Iterator {
  constructor(map) {
    super();
    this.items = Array.from(map.entries());
    this.position = 0;
  }

  hasNext() {
    return this.position < this.items.length;
  }

  next() {
    if (this.hasNext()) {
      const [id, song] = this.items[this.position++];
      return { id, song };
    }
    return null;
  }
}

// Implémentation concrète d'une collection utilisant un tableau
class ArrayPlaylist extends Collection {
  constructor(name) {
    super();
    this.name = name;
    this.songs = [];
  }

  addSong(song) {
    this.songs.push(song);
  }

  createIterator() {
    return new ArrayIterator(this.songs);
  }
}

// Implémentation concrète d'une collection utilisant un Set
class SetPlaylist extends Collection {
  constructor(name) {
    super();
    this.name = name;
    this.songs = new Set();
  }

  addSong(song) {
    this.songs.add(song);
  }

  createIterator() {
    return new SetIterator(this.songs);
  }
}

// Implémentation concrète d'une collection utilisant un Map
class MapPlaylist extends Collection {
  constructor(name) {
    super();
    this.name = name;
    this.songs = new Map();
    this.nextId = 1;
  }

  addSong(song) {
    this.songs.set(this.nextId++, song);
  }

  createIterator() {
    return new MapIterator(this.songs);
  }
}

// Fonction indépendante pour afficher les chansons d'une playlist via un itérateur
function displayPlaylist(playlist) {
  console.log(`\nListe des chansons de la playlist "${playlist.name}":`);
  const iterator = playlist.createIterator();
  let index = 1;

  while (iterator.hasNext()) {
    const item = iterator.next();

    // Adaptation selon le type d'élément retourné
    if (typeof item === 'object' && item !== null && 'id' in item) {
      // Cas de MapIterator
      console.log(`${item.id}. ${item.song}`);
    } else {
      // Cas des autres itérateurs
      console.log(`${index++}. ${item}`);
    }
  }
}

// Itérateur spécial: Ordre inversé pour les tableaux
class ReverseArrayIterator extends Iterator {
  constructor(items) {
    super();
    this.items = items;
    this.position = items.length - 1;
  }

  hasNext() {
    return this.position >= 0;
  }

  next() {
    return this.hasNext() ? this.items[this.position--] : null;
  }
}

// Extension d'ArrayPlaylist pour permettre un itérateur inversé
class ExtendedArrayPlaylist extends ArrayPlaylist {
  createReverseIterator() {
    return new ReverseArrayIterator(this.songs);
  }
}

// Fonction pour afficher les chansons dans l'ordre inverse
function displayPlaylistReversed(playlist) {
  if (!(playlist instanceof ExtendedArrayPlaylist)) {
    console.log("Cette playlist ne supporte pas l'itération inversée");
    return;
  }

  console.log(
    `\nListe inversée des chansons de la playlist "${playlist.name}":`
  );
  const iterator = playlist.createReverseIterator();
  let index = playlist.songs.length;

  while (iterator.hasNext()) {
    console.log(`${index--}. ${iterator.next()}`);
  }
}

// Utilisation avec l'Iterator Pattern
// Création des playlists avec différentes structures
const rockPlaylist = new ArrayPlaylist('Rock Classics');
rockPlaylist.addSong('Queen - Bohemian Rhapsody');
rockPlaylist.addSong('Led Zeppelin - Stairway to Heaven');
rockPlaylist.addSong('AC/DC - Highway to Hell');

const jazzPlaylist = new SetPlaylist('Jazz Favorites');
jazzPlaylist.addSong('Miles Davis - So What');
jazzPlaylist.addSong('John Coltrane - Giant Steps');
jazzPlaylist.addSong('Dave Brubeck - Take Five');

const popPlaylist = new MapPlaylist('Pop Hits');
popPlaylist.addSong('Michael Jackson - Billie Jean');
popPlaylist.addSong('Madonna - Like a Prayer');
popPlaylist.addSong('Prince - Purple Rain');

// Affichage uniforme avec la même fonction, indépendamment du type de collection
displayPlaylist(rockPlaylist);
displayPlaylist(jazzPlaylist);
displayPlaylist(popPlaylist);

// Démonstration d'un itérateur personnalisé (ordre inverse)
const classicPlaylist = new ExtendedArrayPlaylist('Classical Music');
classicPlaylist.addSong('Mozart - Requiem');
classicPlaylist.addSong('Beethoven - Symphony No. 9');
classicPlaylist.addSong('Bach - Toccata and Fugue');

displayPlaylist(classicPlaylist);
displayPlaylistReversed(classicPlaylist);
