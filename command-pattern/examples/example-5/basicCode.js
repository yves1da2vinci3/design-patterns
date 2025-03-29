class Stock {
    constructor(symbol, price) {
      this.symbol = symbol;
      this.price = price;
      this.quantity = 0;
    }
  
    buy(quantity) {
      this.quantity += quantity;
      console.log(`Bought ${quantity} shares of ${this.symbol} at ${this.price}`);
    }
  
    sell(quantity) {
      if (this.quantity >= quantity) {
        this.quantity -= quantity;
        console.log(`Sold ${quantity} shares of ${this.symbol} at ${this.price}`);
      } else {
        console.log(`Not enough shares of ${this.symbol} to sell`);
      }
    }
  }
  
  // Usage
  const stock = new Stock('AAPL', 150);
  stock.buy(10); // Output: Bought 10 shares of AAPL at 150
  stock.sell(5); // Output: Sold 5 shares of AAPL at 150
  