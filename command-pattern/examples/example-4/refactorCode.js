class DrawingApp {
    constructor() {
      this.canvas = [];
      this.history = [];
    }
  
    draw(command) {
      command.execute();
      this.history.push(command);
    }
  
    undo() {
      if (this.history.length > 0) {
        const lastCommand = this.history.pop();
        lastCommand.undo();
      } else {
        console.log("Nothing to undo");
      }
    }
  }
  
  class DrawCommand {
    constructor(canvas, x, y) {
      this.canvas = canvas;
      this.x = x;
      this.y = y;
    }
  
    execute() {
      this.canvas.push({ x: this.x, y: this.y });
      console.log(`Drawing at (${this.x}, ${this.y})`);
    }
  
    undo() {
      const removed = this.canvas.pop();
      console.log(`Undo drawing at (${removed.x}, ${removed.y})`);
    }
  }
  
  // Usage
  const drawingApp = new DrawingApp();
  drawingApp.draw(new DrawCommand(drawingApp.canvas, 10, 20)); // Output: Drawing at (10, 20)
  drawingApp.draw(new DrawCommand(drawingApp.canvas, 30, 40)); // Output: Drawing at (30, 40)
  drawingApp.undo(); // Output: Undo drawing at (30, 40)
  