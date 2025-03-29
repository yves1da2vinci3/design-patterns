class DrawingApp {
    constructor() {
      this.canvas = [];
    }
  
    draw(x, y) {
      this.canvas.push({ x, y });
      console.log(`Drawing at (${x}, ${y})`);
    }
  
    undo() {
      if (this.canvas.length > 0) {
        const removed = this.canvas.pop();
        console.log(`Undo drawing at (${removed.x}, ${removed.y})`);
      } else {
        console.log("Nothing to undo");
      }
    }
  }
  
  // Usage
  const drawingApp = new DrawingApp();
  drawingApp.draw(10, 20); // Output: Drawing at (10, 20)
  drawingApp.draw(30, 40); // Output: Drawing at (30, 40)
  drawingApp.undo(); // Output: Undo drawing at (30, 40)
  