// Implémentation sans le Singleton Pattern
// Exemple d'une connexion à une base de données

class Database {
  constructor(host, username, password) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.isConnected = false;

    console.log(
      `Création d'une nouvelle connexion à la base de données sur ${host}`
    );
    this.connect();
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
}

// Utilisation sans singleton (problématique)
console.log('--- SANS SINGLETON ---');

// Service utilisateur
function getUserService() {
  // Chaque service crée sa propre connexion à la base de données
  const db = new Database('localhost:3306', 'user_service', 'password123');

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
  // Une autre connexion est créée ici
  const db = new Database('localhost:3306', 'product_service', 'password123');

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
  // Encore une autre connexion est créée ici
  const db = new Database('localhost:3306', 'order_controller', 'password123');

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

// Utilisation de chaque service
userService.getUserById(1);
productService.getAllProducts();
orderController.createOrder(1, 2);

// Problèmes:
// 1. Création de multiples connexions à la base de données (coûteux en ressources)
// 2. Aucune garantie que les connexions partagent les mêmes paramètres
// 3. Si la configuration change, il faut la modifier à plusieurs endroits
// 4. Chaque connexion ouvre et maintient des ressources système (sockets, mémoire)
