// Without Command Pattern

class Calculator {
    constructor() {
      this.currentValue = 0;
    }
  
    add(value) {
      this.currentValue += value;
    }
  
    subtract(value) {
      this.currentValue -= value;
    }
  
    multiply(value) {
      this.currentValue *= value;
    }
  
    divide(value) {
      if (value !== 0) {
        this.currentValue /= value;
      } else {
        console.log("Cannot divide by zero");
      }
    }
  
    getCurrentValue() {
      return this.currentValue;
    }
  }
  
  // Usage
  const calculator = new Calculator();
  calculator.add(5);
  calculator.subtract(2);
  console.log(calculator.getCurrentValue()); // Output: 3
  