# Gestionnaire de Configuration avec le Pattern Singleton

## Problème

Dans une application complexe, la gestion de la configuration (paramètres, URLs, timeouts, etc.) peut devenir problématique lorsque plusieurs modules nécessitent d'accéder et de modifier ces paramètres. Sans un point de gestion centralisé, chaque module peut créer sa propre instance de configuration, ce qui mène à plusieurs problèmes:

1. **Incohérence des données** - Des modifications dans un module ne sont pas visibles dans les autres
2. **Duplication des données** - Plusieurs copies des mêmes informations sont stockées en mémoire
3. **Difficultés de maintenance** - Les changements doivent être propagés à plusieurs endroits
4. **Consommation inutile de ressources** - Chaque instance consomme de la mémoire supplémentaire

## Solution: Le Pattern Singleton

Le pattern Singleton garantit qu'une classe n'a qu'une seule instance et fournit un point d'accès global à cette instance. Pour un gestionnaire de configuration, c'est idéal car:

1. **Configuration globale cohérente** - Tous les modules accèdent aux mêmes données
2. **Propagation automatique des changements** - Une modification est immédiatement visible partout
3. **Économie de ressources** - Une seule instance est créée
4. **Point d'accès unique** - Facilite la maintenance et les mises à jour

## Code d'exemple

### Sans le Pattern Singleton (`basicCode.js`)

Dans cette implémentation, chaque module crée sa propre instance du gestionnaire de configuration. Quand un module modifie un paramètre, les autres modules continuent d'utiliser leurs anciennes valeurs.

```javascript
// Chaque module crée sa propre instance
const authConfig = new ConfigManager();
const apiConfig = new ConfigManager();
const loggerConfig = new ConfigManager();

// Les modifications ne sont pas partagées entre les modules
authConfig.setConfig('timeout', 5000); // Modifie uniquement l'instance de auth
console.log(apiConfig.getConfig('timeout')); // Affiche toujours 3000
```

### Avec le Pattern Singleton (`refactorCode.js`)

L'implémentation avec Singleton garantit que tous les modules accèdent à la même instance de configuration.

```javascript
// Le constructeur retourne l'instance existante s'il y en a une
// sinon, il crée une nouvelle instance
const authConfig = new ConfigManager();
const apiConfig = new ConfigManager();
const loggerConfig = new ConfigManager();

// Les trois variables pointent vers la même instance!
console.log(authConfig === apiConfig); // true
console.log(apiConfig === loggerConfig); // true

// Les modifications sont partagées entre tous les modules
authConfig.setConfig('timeout', 5000);
console.log(apiConfig.getConfig('timeout')); // Affiche 5000
```

## Comment le Singleton est implémenté

La classe `ConfigManager` implémente le pattern Singleton de deux façons:

1. **Via le constructeur**: Vérifie si une instance existe déjà et la retourne au lieu d'en créer une nouvelle

```javascript
constructor() {
  if (ConfigManager.instance) {
    return ConfigManager.instance;
  }

  // Initialiser la nouvelle instance
  // ...

  ConfigManager.instance = this;
}
```

2. **Via une méthode statique**: Offre un accès alternatif à l'instance unique

```javascript
static getInstance() {
  if (!ConfigManager.instance) {
    ConfigManager.instance = new ConfigManager();
  }
  return ConfigManager.instance;
}
```

## Points à retenir

- Le Singleton est idéal pour les ressources partagées et globales comme la configuration
- Il garantit la cohérence des données à travers toute l'application
- Il facilite la maintenance en centralisant la logique de gestion
- Il économise les ressources en évitant la duplication

## Cas d'utilisation réels

- Configuration d'application
- Pools de connexions à une base de données
- Cache partagé
- Gestionnaires de journalisation
- Pools de threads
