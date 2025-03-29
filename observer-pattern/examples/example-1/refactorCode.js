// Mise en œuvre de l'Observer Pattern

// Subject (Observable)
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// Classe User qui étend Subject
class User extends Subject {
  constructor(name) {
    super();
    this.name = name;
  }

  updateStatus(status) {
    this.status = status;
    console.log(`${this.name} a mis à jour son statut: ${status}`);
    this.notify({
      user: this.name,
      status: status,
    });
  }
}

// Observer
class Follower {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(
      `${this.name} a reçu une mise à jour: ${data.user} a un nouveau statut: ${data.status}`
    );
  }
}

// Utilisation
const user = new User('Alice');
const follower1 = new Follower('Bob');
const follower2 = new Follower('Charlie');

user.subscribe(follower1);
user.subscribe(follower2);

user.updateStatus("Je suis content aujourd'hui!");

// Désabonnement
user.unsubscribe(follower1);

user.updateStatus('Un nouveau jour!'); // Seul Charlie recevra cette notification
