// Implémentation sans pattern observer
class User {
  constructor(name) {
    this.name = name;
  }

  updateStatus(status) {
    this.status = status;
    console.log(`${this.name} a mis à jour son statut: ${status}`);

    // Notification directe à chaque follower - fortement couplée
    if (this.followers) {
      this.followers.forEach((follower) => {
        follower.notify(`${this.name} a un nouveau statut: ${status}`);
      });
    }
  }

  addFollower(follower) {
    if (!this.followers) {
      this.followers = [];
    }
    this.followers.push(follower);
  }
}

class Follower {
  constructor(name) {
    this.name = name;
  }

  notify(message) {
    console.log(`${this.name} a reçu une notification: ${message}`);
  }
}

// Utilisation
const user = new User('Alice');
const follower1 = new Follower('Bob');
const follower2 = new Follower('Charlie');

user.addFollower(follower1);
user.addFollower(follower2);

user.updateStatus("Je suis content aujourd'hui!");
