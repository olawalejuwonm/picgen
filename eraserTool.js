class EraserTool {
  constructor() {
    //set an icon and a name for the object
    this.icon = "assets/eraser.jpg";
    this.name = "eraserTool";
    this.description = "The eraser tool can be used by pressing and holding on the area of canvas desired to be cleaned."

    let slider;
    this.populateOptions = function () {
      noFill();
      slider = createSlider(30, width / 4, 5);
      createP("Eraser Intensity: ").parent(Gopt);
      slider.parent(Gopt);

      cursor("assets/eraserC.png");
    };
    this.draw = function () {
      let value = slider.value()
      if (mouseIsPressed) {
        stroke(255);
        fill(255);
        strokeWeight(value)
        line(mouseX, mouseY + 10, mouseX + (value/4), (mouseY+10)+(value/4));
      }
    };

    this.unselectTool = function () {
      Gopt.html("");
      let color = select("#color");
      fill(color.value());
      stroke(sc);
      strokeWeight(1);
      cursor();
    };
  }
}
