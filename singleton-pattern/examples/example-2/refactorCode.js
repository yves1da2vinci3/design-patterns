// Implémentation avec le Singleton Pattern
// Exemple d'une connexion à une base de données unique

// Singleton Database
class Database {
  constructor(host, username, password) {
    // Vérifier si l'instance existe déjà
    if (Database.instance) {
      console.log(
        "Base de données déjà instanciée, réutilisation de l'instance existante"
      );
      return Database.instance;
    }

    // Si aucune instance n'existe, créer la nouvelle instance
    this.host = host;
    this.username = username;
    this.password = password;
    this.isConnected = false;

    console.log(
      `Création d'une nouvelle connexion à la base de données sur ${host}`
    );
    this.connect();

    // Stocker l'instance dans une propriété statique de la classe
    Database.instance = this;

    // Gélifier l'instance pour empêcher les modifications
    Object.freeze(this);
  }

  connect() {
    // Simuler une connexion à la base de données
    console.log(
      `Connexion à la base de données établie avec ${this.username}@${this.host}`
    );
    this.isConnected = true;
  }

  query(sql) {
    if (!this.isConnected) {
      console.log("Erreur: La base de données n'est pas connectée!");
      return null;
    }
    console.log(`Exécution de la requête: ${sql}`);
    return `Résultats pour: ${sql}`;
  }

  disconnect() {
    if (this.isConnected) {
      console.log('Déconnexion de la base de données');
      this.isConnected = false;
    }
  }

  // Méthode statique pour obtenir l'instance
  static getInstance(host, username, password) {
    if (!Database.instance) {
      Database.instance = new Database(host, username, password);
    }
    return Database.instance;
  }
}

// Configuration centralisée
const DB_CONFIG = {
  host: 'localhost:3306',
  username: 'app_user',
  password: 'secure_password',
};

// Utilisation avec singleton
console.log('--- AVEC SINGLETON ---');

// Service utilisateur
function getUserService() {
  // Réutilisation de l'instance unique de base de données
  const db = Database.getInstance(
    DB_CONFIG.host,
    DB_CONFIG.username,
    DB_CONFIG.password
  );

  return {
    getUserById: function (id) {
      return db.query(`SELECT * FROM users WHERE id = ${id}`);
    },
    getAllUsers: function () {
      return db.query('SELECT * FROM users');
    },
  };
}

// Service de produits
function getProductService() {
  // Réutilisation de la même instance de base de données
  const db = Database.getInstance(
    DB_CONFIG.host,
    DB_CONFIG.username,
    DB_CONFIG.password
  );

  return {
    getProductById: function (id) {
      return db.query(`SELECT * FROM products WHERE id = ${id}`);
    },
    getAllProducts: function () {
      return db.query('SELECT * FROM products');
    },
  };
}

// Contrôleur pour les commandes
function getOrderController() {
  // Réutilisation de la même instance de base de données
  const db = Database.getInstance(
    DB_CONFIG.host,
    DB_CONFIG.username,
    DB_CONFIG.password
  );

  return {
    createOrder: function (userId, productId) {
      return db.query(
        `INSERT INTO orders (user_id, product_id) VALUES (${userId}, ${productId})`
      );
    },
  };
}

// Utilisation
const userService = getUserService();
const productService = getProductService();
const orderController = getOrderController();

// Utilisation de chaque service (utilise la même connexion)
userService.getUserById(1);
productService.getAllProducts();
orderController.createOrder(1, 2);

// Démonstration que c'est la même instance
const db1 = new Database(
  DB_CONFIG.host,
  DB_CONFIG.username,
  DB_CONFIG.password
);
const db2 = new Database(
  DB_CONFIG.host,
  DB_CONFIG.username,
  DB_CONFIG.password
);
console.log(`db1 === db2: ${db1 === db2}`); // Doit afficher true

// On peut également tenter de créer une instance via le constructeur directement
const db3 = Database.getInstance(
  DB_CONFIG.host,
  DB_CONFIG.username,
  DB_CONFIG.password
);
console.log(`db1 === db3: ${db1 === db3}`); // Doit afficher true

// Avantages:
// 1. Une seule connexion à la base de données partagée dans toute l'application
// 2. Configuration centralisée facile à maintenir
// 3. Économie significative de ressources système
// 4. Garantie que tous les services utilisent les mêmes paramètres
