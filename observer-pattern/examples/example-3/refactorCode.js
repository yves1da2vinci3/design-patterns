// Implémentation avec le Pattern Observer
// Exemple: Système de surveillance du marché boursier

// Interface Observable
class Observable {
  constructor() {
    this.observers = new Map(); // Map de catégories d'événements -> liste d'observateurs
  }

  // Abonner un observateur à une catégorie d'événements
  subscribe(eventType, observer) {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, []);
    }

    const observers = this.observers.get(eventType);
    if (!observers.includes(observer)) {
      observers.push(observer);
      console.log(`Observateur inscrit pour l'événement: ${eventType}`);
    }
  }

  // Désabonner un observateur d'une catégorie d'événements
  unsubscribe(eventType, observer) {
    if (!this.observers.has(eventType)) {
      return;
    }

    const observers = this.observers.get(eventType);
    const index = observers.indexOf(observer);

    if (index !== -1) {
      observers.splice(index, 1);
      console.log(`Observateur retiré de l'événement: ${eventType}`);

      // Supprimer la catégorie si plus d'observateurs
      if (observers.length === 0) {
        this.observers.delete(eventType);
      }
    }
  }

  // Notifier tous les observateurs abonnés à une catégorie
  notify(eventType, data) {
    if (!this.observers.has(eventType)) {
      return;
    }

    const observers = this.observers.get(eventType);
    for (const observer of observers) {
      observer.update(eventType, data);
    }
  }
}

// Interface Observer
class Observer {
  update(eventType, data) {
    // Méthode à implémenter par les classes concrètes
  }
}

// Événements du marché boursier
const MarketEvents = {
  STOCK_ADDED: 'stock-added',
  STOCK_REMOVED: 'stock-removed',
  PRICE_CHANGED: 'price-changed',
  MARKET_OPENED: 'market-opened',
  MARKET_CLOSED: 'market-closed',
};

// Marché boursier (Observable concret)
class StockMarket extends Observable {
  constructor(name) {
    super();
    this.name = name;
    this.stocks = {};
    this.isOpen = false;
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      console.log(`Marché ${this.name} ouvert`);

      // Notifier les observateurs que le marché est ouvert
      this.notify(MarketEvents.MARKET_OPENED, {
        marketName: this.name,
        timestamp: new Date(),
      });
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      console.log(`Marché ${this.name} fermé`);

      // Notifier les observateurs que le marché est fermé
      this.notify(MarketEvents.MARKET_CLOSED, {
        marketName: this.name,
        timestamp: new Date(),
      });
    }
  }

  addStock(symbol, initialPrice) {
    this.stocks[symbol] = initialPrice;
    console.log(`Action ${symbol} ajoutée au marché à ${initialPrice}€`);

    // Notifier les observateurs qu'une nouvelle action a été ajoutée
    this.notify(MarketEvents.STOCK_ADDED, {
      symbol,
      price: initialPrice,
      marketName: this.name,
    });
  }

  removeStock(symbol) {
    if (this.stocks[symbol]) {
      const price = this.stocks[symbol];
      delete this.stocks[symbol];
      console.log(`Action ${symbol} retirée du marché`);

      // Notifier les observateurs qu'une action a été retirée
      this.notify(MarketEvents.STOCK_REMOVED, {
        symbol,
        lastPrice: price,
        marketName: this.name,
      });

      return true;
    }

    console.log(`Erreur: Action ${symbol} non trouvée`);
    return false;
  }

  updateStockPrice(symbol, newPrice) {
    if (!this.stocks[symbol]) {
      console.log(`Erreur: Action ${symbol} non trouvée`);
      return false;
    }

    const oldPrice = this.stocks[symbol];
    const percentChange = (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);

    this.stocks[symbol] = newPrice;
    console.log(
      `Prix de ${symbol} mis à jour: ${oldPrice}€ → ${newPrice}€ (${percentChange}%)`
    );

    // Notifier les observateurs du changement de prix
    this.notify(MarketEvents.PRICE_CHANGED, {
      symbol,
      oldPrice,
      newPrice,
      percentChange,
      timestamp: new Date(),
      marketName: this.name,
    });

    return true;
  }

  getStockPrice(symbol) {
    return this.stocks[symbol];
  }

  getAllStocks() {
    return Object.entries(this.stocks).map(([symbol, price]) => ({
      symbol,
      price,
    }));
  }
}

// Investisseur (Observer concret)
class Investor extends Observer {
  constructor(name, budget) {
    super();
    this.name = name;
    this.budget = budget;
    this.portfolio = {}; // Actions détenues: symbole -> quantité
    this.watchlist = new Set(); // Ensemble des actions à surveiller
    this.marketRef = null; // Référence au marché - ajoutée pour faciliter les transactions
  }

  // Implémentation de la méthode Observer.update
  update(eventType, data) {
    switch (eventType) {
      case MarketEvents.STOCK_ADDED:
        this.handleNewStock(data);
        break;
      case MarketEvents.PRICE_CHANGED:
        this.handlePriceChange(data);
        break;
      case MarketEvents.MARKET_OPENED:
        console.log(`[${this.name}] Le marché ${data.marketName} est ouvert`);
        break;
      case MarketEvents.MARKET_CLOSED:
        console.log(`[${this.name}] Le marché ${data.marketName} est fermé`);
        break;
      case MarketEvents.STOCK_REMOVED:
        if (this.watchlist.has(data.symbol)) {
          console.log(
            `[${this.name}] Alerte: ${data.symbol} a été retiré du marché`
          );
          this.watchlist.delete(data.symbol);
        }
        break;
    }
  }

  handleNewStock(data) {
    console.log(
      `[${this.name}] Nouvelle action disponible: ${data.symbol} à ${data.price}€`
    );

    // Analyser automatiquement la nouvelle action
    this.analyzeStock(data.symbol, data.price);
  }

  handlePriceChange(data) {
    // Vérifier si l'action est dans le portefeuille
    if (this.portfolio[data.symbol]) {
      const shares = this.portfolio[data.symbol];
      const valueChange = (data.newPrice - data.oldPrice) * shares;
      const totalValue = data.newPrice * shares;

      console.log(
        `[${this.name}] Mise à jour de portefeuille - ${
          data.symbol
        }: ${shares} actions, valeur: ${totalValue}€ (${
          valueChange > 0 ? '+' : ''
        }${valueChange}€)`
      );
    }

    // Vérifier si l'action est dans la liste de surveillance
    if (this.watchlist.has(data.symbol)) {
      console.log(
        `[${this.name}] Alerte - ${data.symbol}: ${data.oldPrice}€ → ${data.newPrice}€ (${data.percentChange}%)`
      );

      // Décision d'achat ou de vente basée sur le changement de prix
      this.makeInvestmentDecision(data);
    }
  }

  // Connecter l'investisseur à un marché
  joinMarket(market) {
    this.marketRef = market;

    // S'abonner aux événements pertinents
    market.subscribe(MarketEvents.STOCK_ADDED, this);
    market.subscribe(MarketEvents.PRICE_CHANGED, this);
    market.subscribe(MarketEvents.MARKET_OPENED, this);
    market.subscribe(MarketEvents.MARKET_CLOSED, this);
    market.subscribe(MarketEvents.STOCK_REMOVED, this);

    console.log(`[${this.name}] a rejoint le marché ${market.name}`);
  }

  leaveMarket(market) {
    // Se désabonner de tous les événements
    market.unsubscribe(MarketEvents.STOCK_ADDED, this);
    market.unsubscribe(MarketEvents.PRICE_CHANGED, this);
    market.unsubscribe(MarketEvents.MARKET_OPENED, this);
    market.unsubscribe(MarketEvents.MARKET_CLOSED, this);
    market.unsubscribe(MarketEvents.STOCK_REMOVED, this);

    if (this.marketRef === market) {
      this.marketRef = null;
    }

    console.log(`[${this.name}] a quitté le marché ${market.name}`);
  }

  watchStock(symbol) {
    if (this.marketRef && this.marketRef.getStockPrice(symbol)) {
      this.watchlist.add(symbol);
      console.log(`[${this.name}] ${symbol} ajouté à la liste de surveillance`);
    } else {
      console.log(
        `[${this.name}] Erreur: Action ${symbol} non disponible sur le marché`
      );
    }
  }

  unwatchStock(symbol) {
    if (this.watchlist.has(symbol)) {
      this.watchlist.delete(symbol);
      console.log(
        `[${this.name}] ${symbol} retiré de la liste de surveillance`
      );
    }
  }

  buyStock(symbol, quantity) {
    if (!this.marketRef) {
      console.log(`[${this.name}] Erreur: Non connecté à un marché`);
      return false;
    }

    const price = this.marketRef.getStockPrice(symbol);

    if (!price) {
      console.log(`[${this.name}] Erreur: Action ${symbol} non disponible`);
      return false;
    }

    const cost = price * quantity;

    if (cost > this.budget) {
      console.log(
        `[${this.name}] Fonds insuffisants pour acheter ${quantity} ${symbol}`
      );
      return false;
    }

    // Effectuer l'achat
    this.budget -= cost;

    if (this.portfolio[symbol]) {
      this.portfolio[symbol] += quantity;
    } else {
      this.portfolio[symbol] = quantity;
    }

    console.log(
      `[${this.name}] Achat: ${quantity} ${symbol} à ${price}€ (Total: ${cost}€)`
    );
    return true;
  }

  sellStock(symbol, quantity) {
    if (!this.marketRef) {
      console.log(`[${this.name}] Erreur: Non connecté à un marché`);
      return false;
    }

    if (!this.portfolio[symbol] || this.portfolio[symbol] < quantity) {
      console.log(
        `[${this.name}] Actions insuffisantes pour vendre ${quantity} ${symbol}`
      );
      return false;
    }

    const price = this.marketRef.getStockPrice(symbol);
    const revenue = price * quantity;

    // Effectuer la vente
    this.budget += revenue;
    this.portfolio[symbol] -= quantity;

    // Retirer de l'inventaire si plus d'actions
    if (this.portfolio[symbol] === 0) {
      delete this.portfolio[symbol];
    }

    console.log(
      `[${this.name}] Vente: ${quantity} ${symbol} à ${price}€ (Total: ${revenue}€)`
    );
    return true;
  }

  // Analyser une action pour décider si elle est intéressante à suivre
  analyzeStock(symbol, price) {
    // Stratégie simple: ajouter automatiquement à la liste de suivi les actions abordables
    if (price < 500 && this.budget > price * 5) {
      this.watchStock(symbol);
    }
  }

  makeInvestmentDecision(data) {
    const { symbol, oldPrice, newPrice, percentChange } = data;

    // Stratégie simple: acheter si le prix baisse, vendre si le prix monte
    if (parseFloat(percentChange) <= -5) {
      // Baisse significative, opportunité d'achat
      const quantityToBuy = Math.floor((this.budget * 0.1) / newPrice); // Utiliser 10% du budget

      if (quantityToBuy > 0) {
        console.log(
          `[${this.name}] Opportunité d'achat détectée pour ${symbol}`
        );
        this.buyStock(symbol, quantityToBuy);
      }
    } else if (parseFloat(percentChange) >= 10 && this.portfolio[symbol]) {
      // Hausse significative, opportunité de vente
      const quantityToSell = Math.ceil(this.portfolio[symbol] * 0.5); // Vendre 50% des actions

      if (quantityToSell > 0) {
        console.log(
          `[${this.name}] Opportunité de vente détectée pour ${symbol}`
        );
        this.sellStock(symbol, quantityToSell);
      }
    }
  }

  getPortfolioValue() {
    if (!this.marketRef) {
      return 0;
    }

    let totalValue = 0;

    for (const [symbol, quantity] of Object.entries(this.portfolio)) {
      const currentPrice = this.marketRef.getStockPrice(symbol);
      if (currentPrice) {
        totalValue += currentPrice * quantity;
      }
    }

    return totalValue;
  }

  getPortfolioSummary() {
    console.log(`\n=== Portfolio de ${this.name} ===`);
    console.log(`Budget disponible: ${this.budget}€`);

    if (!this.marketRef) {
      console.log(
        "Non connecté à un marché, impossible d'obtenir les prix actuels"
      );
      return 0;
    }

    let totalValue = 0;

    for (const [symbol, quantity] of Object.entries(this.portfolio)) {
      const currentPrice = this.marketRef.getStockPrice(symbol);
      if (currentPrice) {
        const value = currentPrice * quantity;
        totalValue += value;

        console.log(
          `${symbol}: ${quantity} actions à ${currentPrice}€ = ${value}€`
        );
      }
    }

    console.log(`Valeur totale du portefeuille: ${totalValue}€`);
    console.log(`Valeur nette: ${this.budget + totalValue}€`);

    return totalValue;
  }
}

// Analyste de marché (un autre type d'Observer)
class MarketAnalyst extends Observer {
  constructor(name, speciality) {
    super();
    this.name = name;
    this.speciality = speciality;
    this.stocksTracked = new Set();
    this.priceHistory = {}; // Historique des prix
  }

  update(eventType, data) {
    switch (eventType) {
      case MarketEvents.STOCK_ADDED:
        console.log(
          `[Analyste ${this.name}] Nouvelle action intéressante: ${data.symbol}`
        );
        this.trackStock(data.symbol);
        break;

      case MarketEvents.PRICE_CHANGED:
        if (this.stocksTracked.has(data.symbol)) {
          this.recordPrice(data.symbol, data.newPrice);
          this.analyzeStockTrend(data.symbol, data.percentChange);
        }
        break;
    }
  }

  trackStock(symbol) {
    this.stocksTracked.add(symbol);
    this.priceHistory[symbol] = [];
    console.log(`[Analyste ${this.name}] Commence à suivre ${symbol}`);
  }

  recordPrice(symbol, price) {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = [];
    }

    this.priceHistory[symbol].push({
      price,
      timestamp: new Date(),
    });

    // Limiter l'historique à 10 entrées
    if (this.priceHistory[symbol].length > 10) {
      this.priceHistory[symbol].shift();
    }
  }

  analyzeStockTrend(symbol, percentChange) {
    const history = this.priceHistory[symbol];

    if (history.length < 2) {
      return;
    }

    // Analyse simple des tendances
    if (parseFloat(percentChange) > 5) {
      console.log(
        `[Analyste ${this.name}] ${symbol} montre une forte tendance à la hausse (+${percentChange}%)`
      );
    } else if (parseFloat(percentChange) < -5) {
      console.log(
        `[Analyste ${this.name}] ${symbol} montre une forte tendance à la baisse (${percentChange}%)`
      );
    }

    // Calcul de la moyenne mobile
    const priceSum = history.reduce((sum, entry) => sum + entry.price, 0);
    const movingAverage = priceSum / history.length;

    console.log(
      `[Analyste ${this.name}] Moyenne mobile sur ${
        history.length
      } points pour ${symbol}: ${movingAverage.toFixed(2)}€`
    );
  }

  getMarketRecommendations() {
    const recommendations = [];

    for (const symbol of this.stocksTracked) {
      const history = this.priceHistory[symbol];

      if (history.length < 2) {
        continue;
      }

      const current = history[history.length - 1].price;
      const previous = history[history.length - 2].price;
      const percentChange = (((current - previous) / previous) * 100).toFixed(
        2
      );

      let recommendation;

      if (parseFloat(percentChange) > 3) {
        recommendation = 'VENDRE';
      } else if (parseFloat(percentChange) < -3) {
        recommendation = 'ACHETER';
      } else {
        recommendation = 'CONSERVER';
      }

      recommendations.push({
        symbol,
        currentPrice: current,
        recommendation,
        reason: `Variation récente de ${percentChange}%`,
      });
    }

    return recommendations;
  }

  publishAnalysis() {
    console.log(
      `\n=== Analyse de marché par ${this.name} (spécialité: ${this.speciality}) ===`
    );

    const recommendations = this.getMarketRecommendations();

    if (recommendations.length === 0) {
      console.log('Pas assez de données pour fournir des recommandations');
      return;
    }

    for (const rec of recommendations) {
      console.log(
        `${rec.symbol} - ${rec.currentPrice}€ - ${rec.recommendation} - ${rec.reason}`
      );
    }
  }
}

// Utilisation du système avec le pattern Observer
console.log('=== SIMULATION DU MARCHÉ BOURSIER AVEC PATTERN OBSERVER ===\n');

// Création du marché
const nyse = new StockMarket('NYSE');

// Création des investisseurs
const alice = new Investor('Alice', 10000);
const bob = new Investor('Bob', 5000);
const charlie = new Investor('Charlie', 15000);

// Création d'un analyste de marché
const analyst = new MarketAnalyst('David', 'Technologies');

// Connexion des investisseurs et de l'analyste au marché
alice.joinMarket(nyse);
bob.joinMarket(nyse);
charlie.joinMarket(nyse);

// L'analyste ne s'intéresse qu'aux ajouts d'actions et aux changements de prix
nyse.subscribe(MarketEvents.STOCK_ADDED, analyst);
nyse.subscribe(MarketEvents.PRICE_CHANGED, analyst);

// Ouverture du marché
nyse.open();

// Ajout d'actions au marché - les observateurs sont notifiés automatiquement
nyse.addStock('AAPL', 150.25);
nyse.addStock('GOOGL', 2750.75);
nyse.addStock('AMZN', 3220.5);
nyse.addStock('MSFT', 305.8);

// Configuration manuelle des listes de surveillance
alice.watchStock('MSFT');
bob.watchStock('GOOGL');
bob.watchStock('AMZN');
charlie.watchStock('AAPL');
charlie.watchStock('GOOGL');

// Achats initiaux
alice.buyStock('AAPL', 10);
alice.buyStock('GOOGL', 2);
bob.buyStock('AMZN', 1);
bob.buyStock('MSFT', 5);
charlie.buyStock('AAPL', 20);
charlie.buyStock('MSFT', 10);

// Simulation de fluctuations du marché
console.log('\n=== SIMULATION DES FLUCTUATIONS DU MARCHÉ ===\n');

// Jour 1: Bonnes nouvelles pour Apple
nyse.updateStockPrice('AAPL', 160.75); // +7%

// Jour 2: Mauvais trimestre pour Amazon
nyse.updateStockPrice('AMZN', 2950.3); // -8.4%

// Jour 3: Annonce d'un nouveau produit Google
nyse.updateStockPrice('GOOGL', 2900.1); // +5.4%

// Jour 4: Microsoft déçoit les attentes
nyse.updateStockPrice('MSFT', 285.4); // -6.7%

// Publication de l'analyse de marché
analyst.publishAnalysis();

// Afficher les portefeuilles des investisseurs
alice.getPortfolioSummary();
bob.getPortfolioSummary();
charlie.getPortfolioSummary();

// Fermeture du marché
nyse.close();

// Avantages de cette approche:
// 1. Découplage - Le marché ne connaît pas les détails des observateurs
// 2. Extensibilité - Facile d'ajouter de nouveaux types d'événements et d'observateurs
// 3. Flexibilité - Les observateurs peuvent s'abonner uniquement aux événements qui les intéressent
// 4. Modèle push - Les investisseurs reçoivent automatiquement les mises à jour
// 5. Références correctes - Les observateurs ont accès au marché pour effectuer des transactions
