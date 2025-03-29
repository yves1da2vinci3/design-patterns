// Implémentation avec le Singleton Pattern
// Exemple d'un système de journalisation (logger)

class Logger {
  constructor(name) {
    // Si un logger existe déjà avec ce nom, retourner cette instance
    if (Logger.instances && Logger.instances[name]) {
      return Logger.instances[name];
    }

    this.name = name;
    this.logHistory = [];
    this.logLevel = Logger.globalLogLevel || 'info';

    // Configuration du formatage des logs
    this.dateFormat = Logger.globalDateFormat || 'HH:mm:ss';
    this.includeTimestamp =
      Logger.globalIncludeTimestamp !== undefined
        ? Logger.globalIncludeTimestamp
        : true;

    console.log(`Création d'un nouveau logger: ${name}`);

    // Initialiser le registre des instances si nécessaire
    if (!Logger.instances) {
      Logger.instances = {};
    }

    // Stocker cette instance dans le registre
    Logger.instances[name] = this;

    // Ajouter ce logger à la liste des loggers actifs
    if (!Logger.activeLoggers) {
      Logger.activeLoggers = [];
    }
    Logger.activeLoggers.push(this);
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

  // Méthodes statiques pour la configuration globale

  static setGlobalLogLevel(level) {
    const validLevels = ['debug', 'info', 'warn', 'error'];
    if (validLevels.includes(level)) {
      Logger.globalLogLevel = level;
      console.log(`Niveau de log global changé à ${level}`);

      // Mettre à jour tous les loggers existants
      if (Logger.activeLoggers) {
        Logger.activeLoggers.forEach((logger) => {
          logger.logLevel = level;
        });
      }
    } else {
      console.error(`Niveau de log global invalide: ${level}`);
    }
  }

  static setGlobalConfig(config) {
    if (config.dateFormat) {
      Logger.globalDateFormat = config.dateFormat;
    }

    if (config.includeTimestamp !== undefined) {
      Logger.globalIncludeTimestamp = config.includeTimestamp;
    }

    if (config.logLevel) {
      Logger.setGlobalLogLevel(config.logLevel);
    }

    console.log('Configuration globale du logger mise à jour');
  }

  static getAllLoggers() {
    return Logger.activeLoggers || [];
  }

  static clearAllHistory() {
    if (Logger.activeLoggers) {
      Logger.activeLoggers.forEach((logger) => {
        logger.clearHistory();
      });
    }
  }

  // Méthode pour obtenir une instance existante ou en créer une nouvelle
  static getLogger(name) {
    return new Logger(name); // Le constructeur se charge de vérifier l'unicité
  }
}

// Utilisation avec singleton (solution)
console.log('--- AVEC SINGLETON ---');

// Configuration globale
Logger.setGlobalLogLevel('info');
Logger.setGlobalConfig({
  includeTimestamp: true,
  dateFormat: 'HH:mm:ss',
});

// Différents modules de l'application
class UserModule {
  constructor() {
    // Utilise le singleton pour obtenir un logger
    this.logger = Logger.getLogger('UserModule');
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
    this.logger = Logger.getLogger('CartModule');
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
    this.logger = Logger.getLogger('PaymentModule');
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

// Test du singleton: obtenir à nouveau les mêmes loggers
const userLoggerAgain = Logger.getLogger('UserModule');
const cartLoggerAgain = Logger.getLogger('CartModule');

// Vérification que c'est la même instance
console.log('Vérification des instances:');
console.log(
  'userModule.logger === userLoggerAgain:',
  userModule.logger === userLoggerAgain
); // true
console.log(
  'cartModule.logger === cartLoggerAgain:',
  cartModule.logger === cartLoggerAgain
); // true

// Scénario d'utilisation
userModule.login('admin');
userModule.createUser('alice'); // Logs de debug visibles pour UserModule
cartModule.addToCart('alice', 'Téléphone');
paymentModule.processPayment('alice', 599);

// Activer le mode debug global (affecte tous les loggers)
console.log('\n--- ACTIVATION DU MODE DEBUG GLOBAL ---\n');
Logger.setGlobalLogLevel('debug');

// Maintenant tous les modules montrent les logs de debug
userModule.createUser('bob');
cartModule.addToCart('bob', 'Casque audio');
paymentModule.processPayment('bob', 99); // Même ce module affiche maintenant les logs de niveau info

// Afficher la liste de tous les loggers actifs
console.log(
  '\nLoggers actifs:',
  Logger.getAllLoggers().map((logger) => logger.name)
);

// Avantages:
// 1. Configuration cohérente - Possibilité de configurer globalement tous les loggers
// 2. Logs centralisés - Tous les loggers peuvent être accédés via Logger.getAllLoggers()
// 3. Économie de ressources - Réutilisation des instances existantes
// 4. Organisation par nom - Chaque module a son propre logger, mais tous font partie du même système
// 5. Flexibilité - Les loggers peuvent être configurés individuellement ou globalement
