 

class SprayCanTool {
    constructor() {
        this.name = "sprayCanTool",
            this.icon = "assets/sprayCan.jpg",
            this.description = "The spray can tool sprays on the canvas slowly based on stroke color. Click and hold on the canvas to use it"
            this.points = 13,
            this.spread = 10,
            this.draw = function () {
                //if the mouse is pressed paint on the canvas
                //spread describes how far to spread the paint from the mouse pointer
                //points holds how many pixels of paint for each mouse press.
                if (mouseIsPressed) {
                    for (var i = 0; i < this.points; i++) {
                        point(random(mouseX - this.spread, mouseX + this.spread),
                            random(mouseY - this.spread, mouseY + this.spread));
                    }
                }
            };
    }
}