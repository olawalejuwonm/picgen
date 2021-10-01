class ScissorsTool {
  constructor() {
    this.name = "scissorsTool";
    this.icon = "assets/scissors.png";
    this.description = "Scissors Tool allows you to cut or copy an area on the canvas. The cutted area can be paste by dropping it elsewhere on the canvas. It also allow you to download the area selected as an image file. Click select area to use it";
    this.message = "";
    let selectMode;
    let selectedArea;

    let selectButton;
    let selectedPixels;
    let copyButton;
    let saveButton;

    selectMode = 0;
    selectedArea = { x: 0, y: 0, w: 5, h: 5 };

    //0 no canvas selected
    // select area button clicked set mode to 1
    //cut button clicked set mode to 2

    this.noHistory = true;
    this.draw = () => {
      if (selectMode === 2) { //change cursor
        cursor("grab");
      } else {
        cursor("auto");
      }
      if (mouseIsPressed) {
        if (selectMode == 1) {
          updatePixels();

          noStroke();
          fill(255, 0, 0, 100);
          rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
        }
      }
    };

    this.populateOptions = () => {
      selectButton = createButton("select area");
      selectButton.mousePressed(() => {
        //event code will go here
        if (selectMode == 0) {
          selectMode += 1;
          selectButton.html("cut");

          loadPixels(); // store current frame
        } else if (selectMode == 1) {
          selectMode += 1;
          selectButton.html("end paste");
          this.getSPixels(); //modularise
          //draw a rectangle over it
          fill(255);
          noStroke();
          rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
        } else if (selectMode == 2) {
          selectMode = 0;
          loadPixels();
          helpers.getPixels();

          helpers.awaitSave();
          selectedArea = { x: 0, y: 0, w: 100, h: 100 };
          selectButton.html("select area");
          copyButton = null;
          saveButton = null;
        }
      });

      selectButton.parent(Gopt);
      noFill();
      stroke(0);
      loadPixels();
    };

    this.mousePressed = () => {
      if (selectMode == 1) {
        selectedArea.x = mouseX;
        selectedArea.y = mouseY;
        if (!copyButton && !saveButton) {
          copyButton = createButton("copy");
          copyButton.mousePressed(() => {
            if (selectMode == 1) {
              selectMode += 1;
              selectButton.html("end copy");
              copyButton.hide();

              this.getSPixels();
            }
          });
          saveButton = createButton("save pixel");
          saveButton.mousePressed(() => {
            this.getSPixels();

            if (selectedPixels) {
              selectedPixels.save("myCuttedDrawing", "png");
            }
          });

          copyButton.parent(Gopt);
          saveButton.parent(Gopt);
        }

        this.message = "Drag the mouse on the canvas to select an area";
      } else if (selectMode == 2) {
        this.message = "Drop the image on the canvas";
        image(selectedPixels, mouseX, mouseY);
      } else if (selectMode == 0) {
        this.message =
          "Kindly click select area, to select an area on the canvas";
      }
    };

    this.mouseDragged = () => {
      if (selectMode == 1) {
        let w = mouseX - selectedArea.x;
        let h = mouseY - selectedArea.y;

        selectedArea.w = w;
        selectedArea.h = h;

      }
    };

    this.mouseReleased = () => {
      if (selectMode === 1) {
        this.message =
          "Complete action by cutting, pasting or saving the image";

        return;
      }
      this.message = "";
    };

    this.getSPixels = () => {
      //refresh the screen
      updatePixels();

      //store the pixels
      selectedPixels = get(
        selectedArea.x,
        selectedArea.y,
        selectedArea.w,
        selectedArea.h
      );
    };
  }
}
