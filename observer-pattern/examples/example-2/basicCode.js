// Implémentation sans le Pattern Observer
// Exemple: Système de notification pour une plateforme de médias sociaux

// Classe utilisateur
class User {
  constructor(name) {
    this.name = name;
    this.posts = [];
    this.followers = []; // Liste des followers
  }

  createPost(content) {
    const post = {
      author: this.name,
      content,
      timestamp: new Date(),
      likes: 0,
    };

    this.posts.push(post);
    console.log(`${this.name} a publié: "${content}"`);

    // Notification manuelle à chaque follower
    for (const follower of this.followers) {
      follower.receiveNotification(this.name, 'nouvelle publication', content);
    }

    return post;
  }

  likePost(user, postIndex) {
    if (postIndex >= 0 && postIndex < user.posts.length) {
      user.posts[postIndex].likes++;
      console.log(`${this.name} a aimé la publication de ${user.name}`);

      // Notification manuelle à l'auteur du post
      user.receiveNotification(
        this.name,
        "j'aime",
        user.posts[postIndex].content
      );
    }
  }

  follow(user) {
    // Ajouter cet utilisateur à la liste des followers de l'autre utilisateur
    if (!user.followers.includes(this)) {
      user.followers.push(this);
      console.log(`${this.name} suit maintenant ${user.name}`);

      // Notification manuelle à l'utilisateur suivi
      user.receiveNotification(this.name, 'nouvel abonné', '');
    }
  }

  receiveNotification(fromUser, type, content) {
    let message;

    switch (type) {
      case 'nouvelle publication':
        message = `${fromUser} a publié: "${content}"`;
        break;
      case "j'aime":
        message = `${fromUser} a aimé votre publication: "${content}"`;
        break;
      case 'nouvel abonné':
        message = `${fromUser} a commencé à vous suivre`;
        break;
      default:
        message = `Notification de ${fromUser}`;
    }

    console.log(`[NOTIFICATION pour ${this.name}] ${message}`);
  }
}

// Usage du système sans le pattern Observer
console.log('=== SYSTÈME DE MÉDIAS SOCIAUX SANS PATTERN OBSERVER ===');

// Création des utilisateurs
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

// Bob et Charlie suivent Alice
bob.follow(alice);
charlie.follow(alice);

// Alice publie quelque chose - notifie directement ses followers
alice.createPost('Bonjour tout le monde!');

// Bob aime la publication d'Alice - notifie directement Alice
bob.likePost(alice, 0);

// Charlie publie quelque chose - n'a pas de followers donc pas de notification
charlie.createPost("J'apprends JavaScript!");

// Alice suit Charlie
alice.follow(charlie);

// Charlie publie à nouveau - Alice reçoit une notification
charlie.createPost('Les design patterns sont fascinants!');

// Problèmes avec cette approche:
// 1. Couplage fort - User doit connaître et gérer ses followers
// 2. Responsabilité excessive - User gère à la fois son contenu et les notifications
// 3. Non extensible - Difficile d'ajouter de nouveaux types de notifications
// 4. Duplication de code - Logique de notification répétée dans différentes méthodes
