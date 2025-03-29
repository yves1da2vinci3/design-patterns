// Implémentation avec le Mediator Pattern
// Exemple d'une application de chat avec un médiateur central

// Interface du médiateur (abstraite)
class ChatMediator {
  register(user) {
    throw new Error('La méthode register doit être implémentée');
  }

  sendMessage(message, sender, receiver = null) {
    throw new Error('La méthode sendMessage doit être implémentée');
  }

  blockUser(user, userToBlock) {
    throw new Error('La méthode blockUser doit être implémentée');
  }
}

// Participant (Colleague)
class User {
  constructor(name, mediator) {
    this.name = name;
    this.mediator = mediator;
    this.chatLog = [];
    this.blockedUsers = new Set();
  }

  send(message, receiver = null) {
    this.mediator.sendMessage(message, this, receiver);
  }

  receive(message, sender) {
    // Vérifie si l'expéditeur est bloqué
    if (this.blockedUsers.has(sender.name)) {
      console.log(
        `[${this.name} a ignoré un message de ${sender.name} (bloqué)]`
      );
      return;
    }

    const logEntry = `${sender.name}: ${message}`;
    this.chatLog.push(logEntry);
    console.log(`[${this.name} a reçu] ${logEntry}`);
  }

  block(user) {
    this.mediator.blockUser(this, user);
  }

  addToBlockedList(user) {
    this.blockedUsers.add(user.name);
    console.log(`${this.name} a bloqué ${user.name}.`);
  }

  displayChatLog() {
    console.log(`\nJournal de chat de ${this.name}:`);
    this.chatLog.forEach((log) => console.log(`- ${log}`));
  }
}

// Médiateur concret qui gère les interactions entre utilisateurs
class ChatRoom extends ChatMediator {
  constructor() {
    super();
    this.users = {};
    this.chatRooms = {};
  }

  register(user) {
    this.users[user.name] = user;
    console.log(`${user.name} a rejoint le chat!`);
    return user;
  }

  sendMessage(message, sender, receiver = null) {
    // Message privé
    if (receiver) {
      const actualReceiver = this.users[receiver.name];
      if (actualReceiver) {
        console.log(`${sender.name} envoie à ${receiver.name}: ${message}`);
        actualReceiver.receive(message, sender);
      } else {
        console.log(`Utilisateur ${receiver.name} non trouvé.`);
      }
    }
    // Message à tous les utilisateurs
    else {
      console.log(`${sender.name} envoie à tous: ${message}`);
      Object.values(this.users).forEach((user) => {
        if (user.name !== sender.name) {
          user.receive(message, sender);
        }
      });
    }
  }

  blockUser(user, userToBlock) {
    user.addToBlockedList(userToBlock);
  }

  // Fonctionnalité supplémentaire: création de salles de chat thématiques
  createChatRoom(roomName) {
    this.chatRooms[roomName] = {
      name: roomName,
      participants: new Set(),
      messages: [],
    };
    console.log(`Nouvelle salle de chat "${roomName}" créée.`);
    return this.chatRooms[roomName];
  }

  joinChatRoom(user, roomName) {
    if (this.chatRooms[roomName]) {
      this.chatRooms[roomName].participants.add(user.name);
      console.log(`${user.name} a rejoint la salle "${roomName}".`);
    } else {
      console.log(`La salle "${roomName}" n'existe pas.`);
    }
  }

  sendToRoom(message, sender, roomName) {
    const room = this.chatRooms[roomName];
    if (!room) {
      console.log(`La salle "${roomName}" n'existe pas.`);
      return;
    }

    if (!room.participants.has(sender.name)) {
      console.log(`${sender.name} n'est pas membre de la salle "${roomName}".`);
      return;
    }

    console.log(`${sender.name} envoie à la salle "${roomName}": ${message}`);
    room.messages.push({ sender: sender.name, message });

    Object.values(this.users).forEach((user) => {
      if (user.name !== sender.name && room.participants.has(user.name)) {
        user.receive(`[${roomName}] ${message}`, sender);
      }
    });
  }

  displayRoomHistory(roomName) {
    const room = this.chatRooms[roomName];
    if (room) {
      console.log(`\nHistorique de la salle "${roomName}":`);
      room.messages.forEach((msg) => {
        console.log(`- ${msg.sender}: ${msg.message}`);
      });
    } else {
      console.log(`La salle "${roomName}" n'existe pas.`);
    }
  }
}

// Utilisation avec le Mediator Pattern

// Création du médiateur
const chatMediator = new ChatRoom();

// Création des utilisateurs avec une référence au médiateur
const alice = new User('Alice', chatMediator);
const bob = new User('Bob', chatMediator);
const charlie = new User('Charlie', chatMediator);
const dave = new User('Dave', chatMediator);

// Enregistrement des utilisateurs auprès du médiateur
chatMediator.register(alice);
chatMediator.register(bob);
chatMediator.register(charlie);
chatMediator.register(dave);

// Communication via le médiateur
alice.send('Salut Bob, comment vas-tu?', bob);
bob.send('Je vais bien, merci Alice!', alice);

// Message à tous
alice.send('Bonjour à tous!');

// Charlie bloque Bob
charlie.block(bob);

// Bob essaie d'envoyer un message à Charlie (sera ignoré)
bob.send("Charlie, pourquoi tu m'ignores?", charlie);

// Création d'une salle de chat thématique
const techRoom = chatMediator.createChatRoom('TechTalk');

// Utilisateurs rejoignant la salle
chatMediator.joinChatRoom(alice, 'TechTalk');
chatMediator.joinChatRoom(bob, 'TechTalk');
chatMediator.joinChatRoom(dave, 'TechTalk');

// Messages dans la salle spécifique
alice.mediator.sendToRoom('Qui connaît JavaScript?', alice, 'TechTalk');
bob.mediator.sendToRoom('Moi, je suis développeur front-end!', bob, 'TechTalk');
dave.mediator.sendToRoom(
  'Je préfère Python personnellement.',
  dave,
  'TechTalk'
);

// Charlie essaie d'envoyer un message mais n'est pas dans la salle
charlie.mediator.sendToRoom('Je peux aider aussi!', charlie, 'TechTalk');

// Affichage des journaux de chat
alice.displayChatLog();
bob.displayChatLog();
charlie.displayChatLog();
dave.displayChatLog();

// Affichage de l'historique de la salle
chatMediator.displayRoomHistory('TechTalk');
