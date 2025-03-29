# Système de Journalisation avec le Pattern Singleton

## Problème

Dans une application, la journalisation (logging) est un service transversal qui est utilisé par de nombreux composants. Sans une approche centralisée, chaque module créera sa propre instance de logger, conduisant à plusieurs problèmes:

1. **Configuration incohérente** - Impossibilité d'appliquer des paramètres communs à tous les loggers
2. **Logs dispersés** - Difficile d'avoir une vue d'ensemble des activités de l'application
3. **Gestion inefficace des ressources** - Duplication des fonctionnalités et consommation de mémoire
4. **Maintenance compliquée** - Changements de configuration à effectuer dans plusieurs endroits

## Solution: Le Pattern Singleton avec Registre

Cette implémentation utilise une variante du pattern Singleton appelée "Singleton avec registre", où:

1. La classe gère un ensemble d'instances uniques identifiées par un nom
2. Une instance unique est créée pour chaque nom de logger (par module)
3. Une configuration globale peut être appliquée à toutes les instances

Cette approche combine les avantages du Singleton (unicité, point d'accès global) tout en permettant une organisation logique par module.

## Code d'exemple

### Sans le Pattern Singleton (`basicCode.js`)

Dans cette implémentation, chaque module crée sa propre instance de logger, sans coordination entre elles:

```javascript
// Module 1
const logger1 = new Logger('Module1');
logger1.setLogLevel('debug');

// Module 2
const logger2 = new Logger('Module2');
logger2.setLogLevel('info');

// Les changements dans un logger n'affectent pas les autres
// Impossible de configurer tous les loggers en même temps
```

### Avec le Pattern Singleton (`refactorCode.js`)

L'implémentation avec Singleton permet une gestion centralisée des loggers:

```javascript
// Configuration globale qui affecte tous les loggers
Logger.setGlobalLogLevel('info');

// Obtention de loggers par nom (crée ou récupère une instance existante)
const logger1 = Logger.getLogger('Module1');
const logger2 = Logger.getLogger('Module2');

// Les deux instances sont uniques par nom
const logger1again = Logger.getLogger('Module1');
console.log(logger1 === logger1again); // true

// Modification du niveau de log global
Logger.setGlobalLogLevel('debug');
// Tous les loggers sont maintenant en mode debug
```

## Comment le Singleton avec Registre est implémenté

La classe `Logger` implémente plusieurs mécanismes:

1. **Constructeur avec vérification d'unicité par nom**:

```javascript
constructor(name) {
  // Si un logger existe déjà avec ce nom, retourner cette instance
  if (Logger.instances && Logger.instances[name]) {
    return Logger.instances[name];
  }

  // Sinon, créer une nouvelle instance et l'enregistrer
  this.name = name;
  // ...

  // Initialiser le registre si nécessaire
  if (!Logger.instances) {
    Logger.instances = {};
  }

  // Stocker cette instance dans le registre
  Logger.instances[name] = this;
}
```

2. **Méthode factory statique**:

```javascript
static getLogger(name) {
  return new Logger(name); // Le constructeur se charge de vérifier l'unicité
}
```

3. **Configuration globale avec application à toutes les instances**:

```javascript
static setGlobalLogLevel(level) {
  Logger.globalLogLevel = level;

  // Mettre à jour tous les loggers existants
  if (Logger.activeLoggers) {
    Logger.activeLoggers.forEach(logger => {
      logger.logLevel = level;
    });
  }
}
```

## Points à retenir

- Le Singleton avec registre est idéal pour les services partagés qui nécessitent une organisation par nom/module
- Il permet de combiner gestion centralisée et organisation logique
- Il facilite la configuration globale tout en permettant des ajustements par instance
- Il économise les ressources en évitant la duplication
- Il offre un moyen d'accéder à toutes les instances depuis un point central

## Cas d'utilisation réels

- Systèmes de journalisation (Winston, Log4j, etc.)
- Gestion de connexions aux bases de données par nom
- Gestionnaires de configuration avec profils
- Pools de ressources nommés
- Gestionnaires de thèmes ou styles dans les interfaces graphiques
