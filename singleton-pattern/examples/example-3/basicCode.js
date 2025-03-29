// Implémentation sans le Singleton Pattern
// Exemple d'un gestionnaire de configuration d'application

class ConfigManager {
  constructor() {
    this.config = {
      appName: 'MyApp',
      version: '1.0.0',
      apiUrl: 'https://api.example.com',
      timeout: 3000,
      maxRetries: 3,
      debug: false,
    };

    console.log("Création d'un nouveau gestionnaire de configuration");
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
}

// Utilisation sans singleton (problématique)
console.log('--- SANS SINGLETON ---');

// Module d'authentification
class AuthModule {
  constructor() {
    this.configManager = new ConfigManager(); // Nouvelle instance
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
    this.configManager = new ConfigManager(); // Nouvelle instance (indépendante)
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
    this.configManager = new ConfigManager(); // Nouvelle instance (indépendante)
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

// L'authentification augmente le timeout
auth.login('user1', 'password123');

// L'API n'est pas consciente de ce changement (instance différente)
api.fetchData('users');

// Activation du mode debug dans le Logger
logger.enableDebug();
logger.log('Test du mode debug');

// Mais le mode debug n'est activé que dans cette instance
console.log(`Mode debug dans Auth: ${auth.configManager.getConfig('debug')}`); // false

// Problèmes:
// 1. Chaque module a sa propre configuration indépendante
// 2. Les changements de configuration dans un module ne sont pas reflétés dans les autres
// 3. Duplication des données et de la logique de configuration
// 4. Incohérence des paramètres à travers l'application
