class Stock {
    constructor(symbol, price) {
      this.symbol = symbol;
      this.price = price;
      this.quantity = 0;
    }
  
    executeCommand(command) {
      command.execute();
    }
  
    buy(quantity) {
      this.executeCommand(new BuyStockCommand(this, quantity));
    }
  
    sell(quantity) {
      this.executeCommand(new SellStockCommand(this, quantity));
    }
  
    updatePrice(price) {
      this.price = price;
    }
  }
  
  class BuyStockCommand {
    constructor(stock, quantity) {
      this.stock = stock;
      this.quantity = quantity;
    }
  
    execute() {
      this.stock.quantity += this.quantity;
      console.log(`Bought ${this.quantity} shares of ${this.stock.symbol} at ${this.stock.price}`);
    }
  
    undo() {
      this.stock.quantity -= this.quantity;
      console.log(`Undo buying ${this.quantity} shares of ${this.stock.symbol}`);
    }
  }
  
  class SellStockCommand {
    constructor(stock, quantity) {
      this.stock = stock;
      this.quantity = quantity;
    }
  
    execute() {
      if (this.stock.quantity >= this.quantity) {
        this.stock.quantity -= this.quantity;
        console.log(`Sold ${this.quantity} shares of ${this.stock.symbol} at ${this.stock.price}`);
      } else {
        console.log(`Not enough shares of ${this.stock.symbol} to sell`);
      }
    }
  
    undo() {
      this.stock.quantity += this.quantity;
      console.log(`Undo selling ${this.quantity} shares of ${this.stock.symbol}`);
    }
  }
  
  // Usage
  const stock = new Stock('AAPL', 150);
  stock.buy(10); // Output: Bought 10 shares of AAPL at 150
  stock.sell(5); // Output: Sold 5 shares of AAPL at 150
  