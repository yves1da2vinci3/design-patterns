// Implémentation sans le Singleton Pattern
// Exemple d'un système de journalisation (logger)

class Logger {
  constructor(name) {
    this.name = name;
    this.logHistory = [];
    this.logLevel = 'info'; // Niveau par défaut: "debug", "info", "warn", "error"

    // Configuration du formatage des logs
    this.dateFormat = 'HH:mm:ss';
    this.includeTimestamp = true;

    console.log(`Création d'un nouveau logger: ${name}`);
  }

  setLogLevel(level) {
    const validLevels = ['debug', 'info', 'warn', 'error'];
    if (validLevels.includes(level)) {
      this.logLevel = level;
      console.log(
        `Niveau de log changé à ${level} pour le logger ${this.name}`
      );
    } else {
      console.error(`Niveau de log invalide: ${level}`);
    }
  }

  formatMessage(level, message) {
    const timestamp = this.includeTimestamp
      ? `[${new Date().toLocaleTimeString()}] `
      : '';
    return `${timestamp}[${level.toUpperCase()}] [${this.name}] ${message}`;
  }

  log(level, message) {
    const levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    // Vérifier si le niveau est suffisant pour être journalisé
    if (levels[level] >= levels[this.logLevel]) {
      const formattedMessage = this.formatMessage(level, message);
      console.log(formattedMessage);
      this.logHistory.push({ level, message, timestamp: new Date() });
    }
  }

  debug(message) {
    this.log('debug', message);
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }

  getHistory() {
    return this.logHistory;
  }

  clearHistory() {
    this.logHistory = [];
    console.log(`Historique effacé pour le logger ${this.name}`);
  }
}

// Utilisation sans singleton (problématique)
console.log('--- SANS SINGLETON ---');

// Différents modules de l'application
class UserModule {
  constructor() {
    this.logger = new Logger('UserModule');
    this.logger.setLogLevel('info');
  }

  createUser(username) {
    this.logger.debug(`Tentative de création d'utilisateur: ${username}`);
    // Logique de création d'utilisateur...
    this.logger.info(`Utilisateur créé: ${username}`);
  }

  login(username) {
    this.logger.info(`Connexion de l'utilisateur: ${username}`);
    // Logique de connexion...
    if (username === 'admin') {
      this.logger.setLogLevel('debug'); // Activer le debug uniquement pour ce module
    }
  }
}

class CartModule {
  constructor() {
    this.logger = new Logger('CartModule');
  }

  addToCart(user, product) {
    this.logger.info(`Ajout au panier: ${product} pour ${user}`);
    // Logique d'ajout au panier...
    if (Math.random() < 0.2) {
      this.logger.error(`Échec d'ajout au panier: ${product} non disponible`);
    }
  }
}

class PaymentModule {
  constructor() {
    this.logger = new Logger('PaymentModule');
    this.logger.setLogLevel('warn'); // Ce module ne journalise que les avertissements et erreurs
  }

  processPayment(user, amount) {
    // Cette ligne ne sera pas journalisée (niveau info < warn)
    this.logger.info(`Traitement du paiement: ${amount}€ pour ${user}`);

    // Simulation d'un problème
    if (Math.random() < 0.3) {
      this.logger.warn(`Paiement lent pour ${user}`);
    }
  }
}

// Utilisation
const userModule = new UserModule();
const cartModule = new CartModule();
const paymentModule = new PaymentModule();

// Scénario d'utilisation
userModule.login('admin');
userModule.createUser('alice'); // Maintenant les logs de debug sont visibles pour UserModule
cartModule.addToCart('alice', 'Téléphone');
paymentModule.processPayment('alice', 599);

// Problèmes:
// 1. Configuration incohérente - Chaque module a sa propre configuration de journalisation
// 2. Logs dispersés - Impossible d'avoir une vue globale des logs de l'application
// 3. Duplication - Chaque module recrée la logique et les ressources de journalisation
// 4. Impossibilité de configurer globalement - ex: changer tous les loggers en mode debug
