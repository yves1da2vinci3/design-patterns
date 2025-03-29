// Implémentation sans le Pattern Observer
// Exemple: Système de surveillance du marché boursier

// Classe représentant le marché boursier
class StockMarket {
  constructor() {
    this.stocks = {}; // Stocke les actions disponibles et leur prix
    this.investors = []; // Liste des investisseurs à notifier
  }

  addStock(symbol, initialPrice) {
    this.stocks[symbol] = initialPrice;
    console.log(`Action ${symbol} ajoutée au marché à ${initialPrice}€`);

    // Notifier tous les investisseurs de la nouvelle action
    for (const investor of this.investors) {
      investor.notifyNewStock(symbol, initialPrice);
    }
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

    // Notifier tous les investisseurs du changement de prix
    for (const investor of this.investors) {
      investor.notifyPriceChange(symbol, oldPrice, newPrice);
    }

    return true;
  }

  registerInvestor(investor) {
    this.investors.push(investor);
    console.log(`Nouvel investisseur enregistré: ${investor.name}`);
  }

  removeInvestor(investor) {
    const index = this.investors.indexOf(investor);
    if (index !== -1) {
      this.investors.splice(index, 1);
      console.log(`Investisseur retiré: ${investor.name}`);
    }
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

// Classe représentant un investisseur
class Investor {
  constructor(name, budget) {
    this.name = name;
    this.budget = budget;
    this.portfolio = {}; // Actions détenues: symbole -> quantité
    this.watchlist = []; // Liste des actions à surveiller
  }

  // Cette méthode est appelée par le marché quand un prix change
  notifyPriceChange(symbol, oldPrice, newPrice) {
    // Vérifier si l'action est dans le portefeuille
    if (this.portfolio[symbol]) {
      const shares = this.portfolio[symbol];
      const valueChange = (newPrice - oldPrice) * shares;
      const totalValue = newPrice * shares;

      console.log(
        `[${
          this.name
        }] Mise à jour de portefeuille - ${symbol}: ${shares} actions, valeur: ${totalValue}€ (${
          valueChange > 0 ? '+' : ''
        }${valueChange}€)`
      );
    }

    // Vérifier si l'action est dans la liste de surveillance
    if (this.watchlist.includes(symbol)) {
      const percentChange = (((newPrice - oldPrice) / oldPrice) * 100).toFixed(
        2
      );
      console.log(
        `[${this.name}] Alerte - ${symbol}: ${oldPrice}€ → ${newPrice}€ (${percentChange}%)`
      );

      // Décision d'achat ou de vente basée sur le changement de prix
      this.makeInvestmentDecision(symbol, oldPrice, newPrice);
    }
  }

  // Cette méthode est appelée par le marché quand une nouvelle action est ajoutée
  notifyNewStock(symbol, price) {
    console.log(
      `[${this.name}] Nouvelle action disponible: ${symbol} à ${price}€`
    );
  }

  addToWatchlist(symbol) {
    if (!this.watchlist.includes(symbol)) {
      this.watchlist.push(symbol);
      console.log(`[${this.name}] ${symbol} ajouté à la liste de surveillance`);
    }
  }

  removeFromWatchlist(symbol) {
    const index = this.watchlist.indexOf(symbol);
    if (index !== -1) {
      this.watchlist.splice(index, 1);
      console.log(
        `[${this.name}] ${symbol} retiré de la liste de surveillance`
      );
    }
  }

  buyStock(market, symbol, quantity) {
    const price = market.getStockPrice(symbol);

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

  sellStock(market, symbol, quantity) {
    if (!this.portfolio[symbol] || this.portfolio[symbol] < quantity) {
      console.log(
        `[${this.name}] Actions insuffisantes pour vendre ${quantity} ${symbol}`
      );
      return false;
    }

    const price = market.getStockPrice(symbol);
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

  makeInvestmentDecision(symbol, oldPrice, newPrice) {
    // Stratégie simple: acheter si le prix baisse, vendre si le prix monte
    const percentChange = ((newPrice - oldPrice) / oldPrice) * 100;

    if (percentChange <= -5) {
      // Baisse significative, opportunité d'achat
      const quantityToBuy = Math.floor((this.budget * 0.1) / newPrice); // Utiliser 10% du budget

      if (quantityToBuy > 0) {
        console.log(
          `[${this.name}] Opportunité d'achat détectée pour ${symbol}`
        );
        // Note: on ne peut pas appeler buyStock ici car on n'a pas accès au marché
        // Dans un système réel, l'investisseur aurait un moyen d'accéder au marché
      }
    } else if (percentChange >= 10 && this.portfolio[symbol]) {
      // Hausse significative, opportunité de vente
      const quantityToSell = Math.ceil(this.portfolio[symbol] * 0.5); // Vendre 50% des actions

      if (quantityToSell > 0) {
        console.log(
          `[${this.name}] Opportunité de vente détectée pour ${symbol}`
        );
        // Même problème: pas d'accès au marché ici
      }
    }
  }

  getPortfolioValue(market) {
    let totalValue = 0;

    for (const [symbol, quantity] of Object.entries(this.portfolio)) {
      const currentPrice = market.getStockPrice(symbol);
      if (currentPrice) {
        totalValue += currentPrice * quantity;
      }
    }

    return totalValue;
  }

  getPortfolioSummary(market) {
    console.log(`\n=== Portfolio de ${this.name} ===`);
    console.log(`Budget disponible: ${this.budget}€`);

    let totalValue = 0;

    for (const [symbol, quantity] of Object.entries(this.portfolio)) {
      const currentPrice = market.getStockPrice(symbol);
      const value = currentPrice * quantity;
      totalValue += value;

      console.log(
        `${symbol}: ${quantity} actions à ${currentPrice}€ = ${value}€`
      );
    }

    console.log(`Valeur totale du portefeuille: ${totalValue}€`);
    console.log(`Valeur nette: ${this.budget + totalValue}€`);

    return totalValue;
  }
}

// Utilisation du système sans le pattern Observer
console.log('=== SIMULATION DU MARCHÉ BOURSIER SANS PATTERN OBSERVER ===\n');

// Création du marché
const market = new StockMarket();

// Ajout d'actions au marché
market.addStock('AAPL', 150.25);
market.addStock('GOOGL', 2750.75);
market.addStock('AMZN', 3220.5);
market.addStock('MSFT', 305.8);

// Création des investisseurs
const investor1 = new Investor('Alice', 10000);
const investor2 = new Investor('Bob', 5000);
const investor3 = new Investor('Charlie', 15000);

// Enregistrement des investisseurs auprès du marché
market.registerInvestor(investor1);
market.registerInvestor(investor2);
market.registerInvestor(investor3);

// Configuration des listes de surveillance
investor1.addToWatchlist('AAPL');
investor1.addToWatchlist('MSFT');
investor2.addToWatchlist('GOOGL');
investor2.addToWatchlist('AMZN');
investor3.addToWatchlist('AAPL');
investor3.addToWatchlist('GOOGL');
investor3.addToWatchlist('AMZN');
investor3.addToWatchlist('MSFT');

// Achats initiaux
investor1.buyStock(market, 'AAPL', 10);
investor1.buyStock(market, 'GOOGL', 2);
investor2.buyStock(market, 'AMZN', 1);
investor2.buyStock(market, 'MSFT', 5);
investor3.buyStock(market, 'AAPL', 20);
investor3.buyStock(market, 'MSFT', 10);

// Simulation de fluctuations du marché
console.log('\n=== SIMULATION DES FLUCTUATIONS DU MARCHÉ ===\n');

// Jour 1: Bonnes nouvelles pour Apple
market.updateStockPrice('AAPL', 160.75); // +7%

// Jour 2: Mauvais trimestre pour Amazon
market.updateStockPrice('AMZN', 2950.3); // -8.4%

// Jour 3: Annonce d'un nouveau produit Google
market.updateStockPrice('GOOGL', 2900.1); // +5.4%

// Jour 4: Microsoft déçoit les attentes
market.updateStockPrice('MSFT', 285.4); // -6.7%

// Afficher les portefeuilles des investisseurs
investor1.getPortfolioSummary(market);
investor2.getPortfolioSummary(market);
investor3.getPortfolioSummary(market);

// Problèmes avec cette approche:
// 1. Couplage fort - Le marché doit connaître et gérer tous les investisseurs
// 2. Manque de flexibilité - Difficile d'ajouter de nouveaux types d'observateurs
// 3. Réutilisation limitée - La logique de notification est spécifique au contexte
// 4. Problèmes d'accès - Les investisseurs n'ont pas accès au marché dans les callbacks
