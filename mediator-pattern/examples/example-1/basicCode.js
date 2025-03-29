// Implémentation sans le Mediator Pattern
// Exemple d'une application de chat avec plusieurs utilisateurs

class User {
  constructor(name) {
    this.name = name;
    this.chatLog = [];
    // Chaque utilisateur doit connaître tous les autres utilisateurs pour communiquer
    this.contacts = [];
  }

  sendMessage(message, receiver) {
    console.log(`${this.name} envoie à ${receiver.name}: ${message}`);
    receiver.receiveMessage(message, this);
  }

  receiveMessage(message, sender) {
    const logEntry = `${sender.name}: ${message}`;
    this.chatLog.push(logEntry);
    console.log(`[${this.name} a reçu] ${logEntry}`);
  }

  // Doit maintenir manuellement sa liste de contacts
  addContact(user) {
    this.contacts.push(user);
    console.log(`${this.name} a ajouté ${user.name} à ses contacts.`);
  }

  // Pour envoyer un message à tous les contacts, doit itérer sur tous les contacts
  sendGroupMessage(message) {
    console.log(`${this.name} envoie à tous: ${message}`);
    this.contacts.forEach((contact) => {
      contact.receiveMessage(message, this);
    });
  }

  // Pour bloquer un utilisateur
  blockUser(user) {
    const index = this.contacts.indexOf(user);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      console.log(`${this.name} a bloqué ${user.name}.`);
    }
    // Problème: l'autre utilisateur ne sait pas qu'il a été bloqué
  }

  displayChatLog() {
    console.log(`\nJournal de chat de ${this.name}:`);
    this.chatLog.forEach((log) => console.log(`- ${log}`));
  }
}

// Utilisation sans médiateur (problématique)

// Création d'utilisateurs
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');
const dave = new User('Dave');

// Configuration manuelle des relations entre utilisateurs
alice.addContact(bob);
alice.addContact(charlie);
alice.addContact(dave);

bob.addContact(alice);
bob.addContact(charlie);
// Bob ne connaît pas Dave

charlie.addContact(alice);
charlie.addContact(bob);
charlie.addContact(dave);

dave.addContact(alice);
dave.addContact(charlie);
// Dave ne connaît pas Bob

// Communication directe
alice.sendMessage('Salut Bob, comment vas-tu?', bob);
bob.sendMessage('Je vais bien, merci Alice!', alice);

// Message de groupe (doit être géré par chaque utilisateur)
alice.sendGroupMessage('Bonjour à tous!');

// Dave essaie d'envoyer à Bob, mais il ne l'a pas dans ses contacts
// dave.sendMessage("Salut Bob!", bob); // Cela fonctionnerait, mais de manière trompeuse car Bob n'est pas dans les contacts de Dave

// Charlie bloque Bob
charlie.blockUser(bob);
// Problème: Bob peut toujours envoyer des messages à Charlie
bob.sendMessage("Charlie, pourquoi tu m'ignores?", charlie);

// Affichage des journaux de chat
alice.displayChatLog();
bob.displayChatLog();
charlie.displayChatLog();
dave.displayChatLog();

// Problèmes:
// 1. Chaque utilisateur doit connaître tous les autres utilisateurs avec lesquels il communique
// 2. La gestion des groupes et des blocages est complexe et incohérente
// 3. Forte interdépendance entre les utilisateurs
// 4. Difficile d'ajouter de nouvelles fonctionnalités (comme les salles de chat) ou règles de communication
