// Implémentation avec le Singleton Pattern
// Exemple d'un gestionnaire de configuration d'application

class ConfigManager {
  constructor() {
    // Vérifier si l'instance existe déjà
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }

    this.config = {
      appName: 'MyApp',
      version: '1.0.0',
      apiUrl: 'https://api.example.com',
      timeout: 3000,
      maxRetries: 3,
      debug: false,
    };

    console.log(
      "Création d'un nouveau gestionnaire de configuration (singleton)"
    );

    // Stocker l'instance dans une propriété statique
    ConfigManager.instance = this;
  }

  getConfig(key) {
    return this.config[key];
  }

  setConfig(key, value) {
    this.config[key] = value;
    console.log(`Configuration mise à jour: ${key} = ${value}`);
  }

  resetConfig() {
    this.config = {
      appName: 'MyApp',
      version: '1.0.0',
      apiUrl: 'https://api.example.com',
      timeout: 3000,
      maxRetries: 3,
      debug: false,
    };
    console.log('Configuration réinitialisée');
  }

  // Méthode statique pour obtenir l'instance (alternative)
  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
}

// Utilisation avec singleton (solution)
console.log('--- AVEC SINGLETON ---');

// Module d'authentification
class AuthModule {
  constructor() {
    this.configManager = new ConfigManager(); // Récupère l'instance unique
  }

  login(username, password) {
    const apiUrl = this.configManager.getConfig('apiUrl');
    const timeout = this.configManager.getConfig('timeout');

    console.log(
      `Tentative de connexion à ${apiUrl} pour l'utilisateur ${username} (timeout: ${timeout}ms)`
    );
    // Logique d'authentification...

    // Mettre à jour la configuration pour augmenter le timeout après un échec
    if (Math.random() > 0.5) {
      this.configManager.setConfig('timeout', timeout + 1000);
      console.log(`Échec de connexion, timeout augmenté à ${timeout + 1000}ms`);
    }
  }
}

// Module API
class ApiModule {
  constructor() {
    // On peut utiliser soit le constructeur soit la méthode statique getInstance
    this.configManager = ConfigManager.getInstance();
  }

  fetchData(endpoint) {
    const apiUrl = this.configManager.getConfig('apiUrl');
    const timeout = this.configManager.getConfig('timeout');

    console.log(
      `Récupération des données depuis ${apiUrl}/${endpoint} (timeout: ${timeout}ms)`
    );
    // Logique d'appel API...
  }
}

// Module de journalisation
class LoggerModule {
  constructor() {
    this.configManager = new ConfigManager(); // Même instance que les autres modules
  }

  log(message) {
    const debug = this.configManager.getConfig('debug');

    if (debug) {
      console.log(`[DEBUG] ${message}`);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }

  enableDebug() {
    this.configManager.setConfig('debug', true);
  }
}

// Utilisation
const auth = new AuthModule();
const api = new ApiModule();
const logger = new LoggerModule();

// Vérification que c'est la même instance
console.log('Comparaison des instances:');
console.log(
  'auth.configManager === api.configManager:',
  auth.configManager === api.configManager
);
console.log(
  'api.configManager === logger.configManager:',
  api.configManager === logger.configManager
);

// L'authentification augmente le timeout
auth.login('user1', 'password123');

// L'API est maintenant consciente de ce changement (même instance)
api.fetchData('users');

// Activation du mode debug dans le Logger
logger.enableDebug();
logger.log('Test du mode debug');

// Le mode debug est activé pour toutes les instances
console.log(`Mode debug dans Auth: ${auth.configManager.getConfig('debug')}`); // true

// Avantages:
// 1. Configuration globale et cohérente à travers l'application
// 2. Les changements effectués dans un module sont visibles dans tous les autres
// 3. Économie de ressources (une seule instance en mémoire)
// 4. Point d'accès global à la configuration

// Note: Une autre façon d'implémenter serait d'utiliser une variable privée pour
// stocker l'instance et de n'exposer que la méthode getInstance. Cela empêcherait
// complètement l'utilisation du constructeur à l'extérieur de la classe.
