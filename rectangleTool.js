class RectangleTool {
  constructor() {
    //set an icon and a name for the object
    this.icon = "assets/rectangle.png";
    this.name = "rectangle";
    this.description =
      "The rectangle tool as the name implies draw a rectangle on the canvas. The fill, stoke and weight can be contolled by selection made. The first mode draws on top of anything on the canvas with no fill, second mode overwrite the canvas with no fill, third mode draws on the canvas with fill color. Click and drag on the canvas to use it";

    var startMouseX = -1;
    var startMouseY = -1;
    var pos = 3; //set mode to 3
    this.selectScale = { x: 0, y: 0, w: 0, h: 0 };
    let pg = createGraphics(windowWidth / 3, 100); //create graphics for visualizing mode

    this.draw = function () {
      cursor("crosshair"); //set cursor

      //fill graphics with current color
      pg.fill(c);
      pg.rect(250, 35, 50, 50);

      if (pos === 3) {
        updatePixels();
        if (mouseIsPressed) {
          noFill();
          stroke(sc);
          rect(
            this.selectScale.x,
            this.selectScale.y,
            this.selectScale.w,
            this.selectScale.h
          );
        }

        return;
      }

      if (mouseIsPressed) {
        if (startMouseX == -1) {
          startMouseX = mouseX;
          startMouseY = mouseY;
          loadPixels();
        } else {
          updatePixels();
          if (pos === 1) {
            noFill();
          }
          if (pos === 2) {
            fill(255);
          }
          stroke(sc);
          rect(
            startMouseX,
            startMouseY,
            abs(startMouseX - mouseX),
            abs(startMouseY - mouseY)
          );
        }
      } else {
        startMouseX = -1;
        startMouseY = -1;
      }

    };

    this.mousePressed = () => {
      if (pos === 3) {
        this.selectScale.x = mouseX;
        this.selectScale.y = mouseY;
      }
    };

    this.mouseDragged = () => {
      if (pos === 3) {
        if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
          let w = mouseX - this.selectScale.x;
          let h = mouseY - this.selectScale.y;

          this.selectScale.w = w;
          this.selectScale.h = h;
        }
      }
    };

    this.mouseReleased = () => {
      if (pos === 3) {
        fill(c);
        rect(
          this.selectScale.x,
          this.selectScale.y,
          this.selectScale.w,
          this.selectScale.h
        );

        loadPixels();
      }
    };

    this.populateOptions = function () {
      //create Graphics to visualize the modes
      pg.background(100);
      pg.fill(255);
      pg.textSize(20);
      pg.text("Click To Select Mode", 10, 30);
      pg.stroke(255);
      pg.noFill();
      pg.rect(45, 50, 40, 20);
      pg.rect(15, 35, 50, 50).mousePressed(() => {
        if (pos === 1) {
          pg.fill(60, 120, 216);
          pg.rect(15, 35, 50, 50);
          pg.noFill();

          pg.rect(45, 50, 40, 20);
        } else {
          pg.fill(100);
          pg.rect(15, 35, 50, 50);
          pg.noFill();
          pg.rect(45, 50, 40, 20);
        }
      });
      pg.fill(100);
      pg.rect(160, 50, 50, 25);
      pg.rect(140, 35, 50, 50).mousePressed(() => {
        if (pos === 2) {
          pg.fill(60, 120, 216);
          pg.rect(140, 35, 50, 50);
          pg.noFill();
        } else {
          pg.fill(100);
          pg.rect(160, 50, 50, 25);
          pg.rect(140, 35, 50, 50);
        }
      });

      pg.canvas.style.display = "block";
      pg.mousePressed(() => {
        if (dist(256, 669, pmouseX, pmouseY) <= 120) {
          pos = 1;
        } else if (dist(384, 670, pmouseX, pmouseY) <= 120) {
          pos = 2;
        } else {
          pos = 3;
        }
        if (pos === 1) {
          pg.fill(60, 120, 216);
          pg.rect(15, 35, 50, 50);
          pg.noFill();
          pg.rect(45, 50, 40, 20);
        } else {
          pg.fill(100);
          pg.rect(15, 35, 50, 50);
          pg.noFill();
          pg.rect(45, 50, 40, 20);
        }

        if (pos === 2) {
          pg.fill(60, 120, 216);
          pg.rect(140, 35, 50, 50);
          pg.noFill();
        } else {
          pg.fill(100);
          pg.rect(160, 50, 50, 25);
          pg.rect(140, 35, 50, 50);
        }
      });

      Gopt.child(pg);
    };

    this.unselectTool = function () {
      cursor();
    };
  }
}
