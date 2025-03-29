// Implémentation avec le Pattern Observer
// Exemple: Système de notification pour une plateforme de médias sociaux

// Interface Observable (Sujet)
class Observable {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(event) {
    for (const observer of this.observers) {
      observer.update(this, event);
    }
  }
}

// Interface Observer
class Observer {
  update(subject, event) {
    // Méthode à implémenter par les classes concrètes
  }
}

// Événement de notification
class NotificationEvent {
  constructor(type, data) {
    this.type = type;
    this.data = data;
    this.timestamp = new Date();
  }
}

// Utilisateur (à la fois Observable et Observer)
class User extends Observable {
  constructor(name) {
    super();
    this.name = name;
    this.posts = [];
    this.notifications = [];
  }

  // Implémentation de l'interface Observer
  update(subject, event) {
    if (subject instanceof User) {
      this.receiveNotification(subject, event);
    }
  }

  createPost(content) {
    const post = {
      author: this.name,
      content,
      timestamp: new Date(),
      likes: 0,
      id: this.posts.length,
    };

    this.posts.push(post);
    console.log(`${this.name} a publié: "${content}"`);

    // Notifier les observateurs d'une nouvelle publication
    this.notifyObservers(
      new NotificationEvent('POST_CREATED', { postId: post.id, content })
    );

    return post;
  }

  likePost(user, postIndex) {
    if (postIndex >= 0 && postIndex < user.posts.length) {
      user.posts[postIndex].likes++;
      console.log(`${this.name} a aimé la publication de ${user.name}`);

      // Notifier l'utilisateur du like (pas besoin d'une boucle)
      user.update(
        this,
        new NotificationEvent('POST_LIKED', {
          postId: postIndex,
          content: user.posts[postIndex].content,
        })
      );
    }
  }

  follow(user) {
    // S'abonner aux notifications de l'utilisateur (s'inscrire comme observateur)
    user.addObserver(this);
    console.log(`${this.name} suit maintenant ${user.name}`);

    // Notifier l'utilisateur qu'il a un nouvel abonné
    user.update(this, new NotificationEvent('NEW_FOLLOWER', {}));
  }

  unfollow(user) {
    // Se désabonner des notifications de l'utilisateur
    user.removeObserver(this);
    console.log(`${this.name} ne suit plus ${user.name}`);
  }

  receiveNotification(fromUser, event) {
    let message;

    switch (event.type) {
      case 'POST_CREATED':
        message = `${fromUser.name} a publié: "${event.data.content}"`;
        break;
      case 'POST_LIKED':
        message = `${fromUser.name} a aimé votre publication: "${event.data.content}"`;
        break;
      case 'NEW_FOLLOWER':
        message = `${fromUser.name} a commencé à vous suivre`;
        break;
      default:
        message = `Notification de ${fromUser.name}`;
    }

    const notification = {
      from: fromUser.name,
      message,
      timestamp: event.timestamp,
      read: false,
    };

    this.notifications.push(notification);
    console.log(`[NOTIFICATION pour ${this.name}] ${message}`);
  }

  getNotifications(onlyUnread = false) {
    if (onlyUnread) {
      return this.notifications.filter((n) => !n.read);
    }
    return this.notifications;
  }

  markNotificationsAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    console.log(`${this.name} a marqué toutes les notifications comme lues`);
  }
}

// Système de notification centralisé (Observateur spécial)
class NotificationSystem extends Observer {
  constructor() {
    super();
    this.logs = [];
  }

  update(subject, event) {
    if (subject instanceof User) {
      const log = {
        user: subject.name,
        eventType: event.type,
        timestamp: event.timestamp,
        data: event.data,
      };

      this.logs.push(log);
      console.log(
        `[SYSTÈME] Événement ${event.type} enregistré pour ${subject.name}`
      );
    }
  }

  getLogs() {
    return this.logs;
  }

  getStatistics() {
    const stats = {
      totalEvents: this.logs.length,
      eventsByType: {},
      eventsByUser: {},
    };

    for (const log of this.logs) {
      // Compter par type d'événement
      if (!stats.eventsByType[log.eventType]) {
        stats.eventsByType[log.eventType] = 0;
      }
      stats.eventsByType[log.eventType]++;

      // Compter par utilisateur
      if (!stats.eventsByUser[log.user]) {
        stats.eventsByUser[log.user] = 0;
      }
      stats.eventsByUser[log.user]++;
    }

    return stats;
  }
}

// Usage du système avec le pattern Observer
console.log('=== SYSTÈME DE MÉDIAS SOCIAUX AVEC PATTERN OBSERVER ===');

// Création des utilisateurs
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

// Création du système de notification central
const notificationSystem = new NotificationSystem();

// Enregistrer tous les utilisateurs auprès du système central
alice.addObserver(notificationSystem);
bob.addObserver(notificationSystem);
charlie.addObserver(notificationSystem);

// Bob et Charlie suivent Alice
bob.follow(alice);
charlie.follow(alice);

// Alice publie quelque chose - tous les observateurs sont notifiés automatiquement
alice.createPost('Bonjour tout le monde!');

// Bob aime la publication d'Alice
bob.likePost(alice, 0);

// Charlie publie quelque chose
charlie.createPost("J'apprends JavaScript!");

// Alice suit Charlie
alice.follow(charlie);

// Charlie publie à nouveau - Alice est notifiée automatiquement
charlie.createPost('Les design patterns sont fascinants!');

// Affichage des notifications non lues d'Alice
console.log("\nNotifications d'Alice:");
alice.getNotifications().forEach((n) => console.log(`- ${n.message}`));

// Statistiques du système
console.log('\nStatistiques du système:');
const stats = notificationSystem.getStatistics();
console.log(`Total des événements: ${stats.totalEvents}`);
console.log('Événements par type:', stats.eventsByType);
console.log('Événements par utilisateur:', stats.eventsByUser);

// Avantages de cette approche:
// 1. Découplage - Les utilisateurs n'ont pas besoin de connaître les détails des autres
// 2. Extensibilité - Facile d'ajouter de nouveaux types d'événements ou d'observateurs
// 3. Séparation des responsabilités - Classes dédiées pour les événements et notifications
// 4. Flexibilité - Les utilisateurs peuvent s'abonner/désabonner dynamiquement
