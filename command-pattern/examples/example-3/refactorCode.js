// With Command Pattern

class Command {
    execute() {
      throw new Error('execute() method must be implemented');
    }
  
    undo() {
      throw new Error('undo() method must be implemented');
    }
  }
  
  class TurnOnCommand extends Command {
    constructor(device) {
      super();
      this.device = device;
    }
  
    execute() {
      this.device.turnOn();
    }
  
    undo() {
      this.device.turnOff();
    }
  }
  
  class TurnOffCommand extends Command {
    constructor(device) {
      super();
      this.device = device;
    }
  
    execute() {
      this.device.turnOff();
    }
  
    undo() {
      this.device.turnOn();
    }
  }
  
  class RemoteControl {
    constructor() {
      this.history = [];
    }
  
    executeCommand(command) {
      command.execute();
      this.history.push(command);
    }
  
    undo() {
      const command = this.history.pop();
      if (command) {
        command.undo();
      }
    }
  }
  
  class TV {
    turnOn() {
      console.log("TV is ON");
    }
  
    turnOff() {
      console.log("TV is OFF");
    }
  }
  
  // Usage
  const tv = new TV();
  const remote = new RemoteControl();
  remote.executeCommand(new TurnOnCommand(tv)); // Output: TV is ON
  remote.executeCommand(new TurnOffCommand(tv)); // Output: TV is OFF
  remote.undo(); // Output: TV is ON
  