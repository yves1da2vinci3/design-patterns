// With Command Pattern

class Calculator {
    constructor() {
      this.currentValue = 0;
      this.history = [];
    }
  
    executeCommand(command) {
      this.currentValue = command.execute(this.currentValue);
      this.history.push(command);
    }
  
    undo() {
      const command = this.history.pop();
      if (command) {
        this.currentValue = command.undo(this.currentValue);
      }
    }
  
    getCurrentValue() {
      return this.currentValue;
    }
  }
  
  class AddCommand {
    constructor(value) {
      this.value = value;
    }
  
    execute(currentValue) {
      return currentValue + this.value;
    }
  
    undo(currentValue) {
      return currentValue - this.value;
    }
  }
  
  class SubtractCommand {
    constructor(value) {
      this.value = value;
    }
  
    execute(currentValue) {
      return currentValue - this.value;
    }
  
    undo(currentValue) {
      return currentValue + this.value;
    }
  }
  
  // Usage
  const calculator = new Calculator();
  calculator.executeCommand(new AddCommand(5));
  calculator.executeCommand(new SubtractCommand(2));
  console.log(calculator.getCurrentValue()); // Output: 3
  calculator.undo();
  console.log(calculator.getCurrentValue()); // Output: 5
  