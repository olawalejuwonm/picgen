class LineToTool {
  constructor() {
    this.icon = "assets/lineTo.jpg";
    this.name = "LineTo";
	this.description = "Line To tool can be use for drawing straight lines from one point to another. Click and drag on the canvas to use it"

    let startMouseX = -1;
    let startMouseY = -1;
    let drawing = false;

    this.draw = function () {
      if (mouseIsPressed) {
        if (startMouseX == -1) {
          startMouseX = mouseX;
          startMouseY = mouseY;
          drawing = true;
          loadPixels();
        } else {
          updatePixels();
          line(startMouseX, startMouseY, mouseX, mouseY);
        }
      } else if (drawing) {
        drawing = false;
        startMouseX = -1;
        startMouseY = -1;
      }
    };
  }
}
