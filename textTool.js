var GlobalInp;
class TextTool {
  constructor() {
    this.name = "TextTool";
    this.icon = "assets/text.png";
    this.draw = this.Draw;
    this.fontSelected = fonts[Object.keys(fonts)[0]] || "Arial";
    this.sel;
    this.populateOptions = this.Populate;
    this.unselectTool = this.Unpopulate;
    this.selectScale = {};
    this.textMode = false;
    this.mousePressed = this.MousePressed;
    this.mouseDragged = this.MouseDragged;
    this.mouseReleased = this.MouseReleased;
    this.keyPressed = this.KeyPressed;
    this.textBtn;
    this.text = "";
    this.noHistory = true;
    this.sizeBtn;
    this.size;
    this.doneBtn;
    this.imgPos;
    this.description =
      "The text Tool can be used by dragging the area to be used for rendering the text on the canvas. After drag an input box (Enter Your Text) to type in your text and an option to change the font Type, font Size will appear. When done writing, click on 'Done' button.";
  }

  Draw() {
    //draw function
    if (this.textMode === true) {
      //draw text captioned size with a rectangle
      noFill();
      stroke(100);
      rect(
        this.selectScale.x,
        this.selectScale.y,
        this.selectScale.w,
        this.selectScale.h
      );

      this.WriteText(); // write the text
    }
    if (this.textMode === false) {
      //To select area
      updatePixels();

      if (mouseIsPressed && mouseX > 5 && mouseY < height - 10) {
        noFill();
        stroke(0);
        rect(
          this.selectScale.x,
          this.selectScale.y,
          this.selectScale.w,
          this.selectScale.h
        );
      }
    }
  }

  Populate() {
    loadPixels();
    cursor("text"); //set cursor
    if (AppMode) {
      this.description = ""
    }
  }

  Unpopulate() {
    if (this.textMode) {
      this.DoneWriting(true); //call this to prompt user if they wish to leave
      //their unsaved changes
    }
    cursor();
  }

  MousePressed() {
    if (mouseX > 5 && mouseY < height - 15 && this.textMode === false) {
      this.selectScale.x = mouseX;
      this.selectScale.y = mouseY;
    }
  }

  KeyPressed() {
    if (keyCode === 8) {
      //when text got deleted
      this.ReWrite(0, 0, 0, 0);
    }

    //when enter key is pressed,this will write on the canvs. It can be uncomment to use
    // if (keyCode === 13 && this.textMode === true) {
    //   this.DoneWriting();
    // }
  }

  MouseDragged() {
    //select area
    if (
      mouseX > 0 &&
      mouseY > 0 &&
      mouseX < width &&
      mouseY < height &&
      this.textMode === false
    ) {
      let w = mouseX - this.selectScale.x;
      let h = mouseY - this.selectScale.y;

      this.selectScale.w = w;
      this.selectScale.h = h;
    }
  }

  ReWrite(x, y, w, h) {
    //draw a rectangle over pixel
    fill(255);
    noStroke();
    rect(
      this.selectScale.x + x,
      this.selectScale.y + y,
      this.selectScale.w + w,
      this.selectScale.h + h
    );
  }

  WriteText() {
    //write the text on the canvas
    fill(c);
    stroke(sc);

    textFont(this.fontSelected);
    textWrap(CHAR);

    text(
      this.text,
      this.selectScale.x,
      this.selectScale.y,
      this.selectScale.w,
      this.selectScale.h
    );
  }

  DoneWriting(unrender) {
    if (unrender) {
      //true when text Input close pre maturely
      this.imgPos = get();
      this.ReWrite(-3, -3, 5, 5);

      image(this.imgPos, 0, 0, width, height);
      if (this.text.length > 0) {
        if (confirm("Do you want to write the text on the canvas?")) {
          //avoid destructive action
          this.ReWrite(-3, -3, 5, 5);

          this.WriteText();
        } else {
          this.ReWrite(-3, -3, 5, 5);
        }
      } else {
        this.ReWrite(-3, -3, 5, 5);
      }
    } else {
      this.ReWrite(-3, -3, 5, 5);

      image(this.imgPos, 0, 0, width, height);
      this.WriteText();
    }

    if (this.textBtn) {
      this.textBtn.remove();
    }

    if (this.sel) {
      this.sel.remove();
    }

    if (this.sizeBtn) {
      this.sizeBtn.remove();
    }

    if (this.doneBtn) {
      this.doneBtn.remove();
    }
    this.textMode = false;
    this.textBtn = null;
    this.sel = null;
    this.sizeBtn = null;
    this.doneBtn = null;
    this.selectScale = { x: -mouseX, y: -mouseY, w: -width, h: -height };
    loadPixels(); //user is done typing save the pixel
    helpers.getPixels();

    helpers.awaitSave();
  }

  MouseReleased() {
    console.log(this.selectScale)
    if (!this.selectScale.w || !this.selectScale.h) {
      return;
    }
    if (!this.textBtn) {
      updatePixels();
      this.imgPos = get();

      this.textBtn = createInput("", "text");
      this.textBtn.id("textToolInput");
      this.textBtn.elt.placeholder = "Enter Text Here";
      scale(1);
      this.textBtn.position(this.selectScale.x, this.selectScale.y);
      this.textMode = true;
      const inpF = () => {
        this.text = this.textBtn.value();
        this.ReWrite(0, 0, 0, 0);
      };
      this.textBtn.input(inpF);
      this.text = "";

      this.mouseReleased(); //recursion to show element below
      loadPixels();
    } else {
      if (!this.sel) {
        this.sel = createSelect();
        for (const font in fonts) {
          this.sel.option(String(font), String(font));
        }
        this.sel.changed(() => {
          this.fontSelected = fonts[this.sel.value()];
          this.ReWrite(0, 0, 0, 0);
        });

        this.sel.parent(Gopt);
      }

      if (!this.sizeBtn) {
        const initValue = max(20, abs(round(random(this.selectScale.h / 3))));
        this.sizeBtn = createInput(initValue, "number");
        textSize(initValue);

        this.sizeBtn.input(() => {
          this.size = Number(this.sizeBtn.value());
          textSize(this.size);

          this.ReWrite(0, 0, 0, 0);
        });

        this.sizeBtn.parent(Gopt);
      }

      if (!this.doneBtn) {
        this.doneBtn = createButton("Done");
        this.doneBtn.mousePressed(() => {
          if (this.textMode) {
            this.DoneWriting();
          }
        });

        this.doneBtn.parent(Gopt);
      }
    }
  }

  DashedRect(x, y, w, h, l, g) {
    l = 1;
    g = 2;
    this.DashedLine(x, y, x + w, y, l, g); //Top
    this.DashedLine(x, y + h, x + w, y + h, l, g); //Bottom
    this.DashedLine(x, y, x, y + h, l, g); //Left
    this.DashedLine(x + w, y, x + w, y + h, l, g); //Right
  }

  DashedLine(x1, y1, x2, y2, l, g) {
    var pc = dist(x1, y1, x2, y2) / 100;
    var pcCount = 1;
    var lPercent = 0;
    var gPercent = lPercent;
    var currentPos = 0;
    var xx1 = 0;
    var yy1 = xx1;
    var xx2 = yy1;
    var yy2 = xx2;

    while (int(pcCount * pc) < l) {
      pcCount++;
    }
    lPercent = pcCount;
    pcCount = 1;
    while (int(pcCount * pc) < g) {
      pcCount++;
    }
    gPercent = pcCount;

    lPercent = lPercent / 100;
    gPercent = gPercent / 100;
    while (currentPos < 1) {
      xx1 = lerp(x1, x2, currentPos);
      yy1 = lerp(y1, y2, currentPos);
      xx2 = lerp(x1, x2, currentPos + lPercent);
      yy2 = lerp(y1, y2, currentPos + lPercent);
      if (x1 > x2) {
        if (xx2 < x2) {
          xx2 = x2;
        }
      }
      if (x1 < x2) {
        if (xx2 > x2) {
          xx2 = x2;
        }
      }
      if (y1 > y2) {
        if (yy2 < y2) {
          yy2 = y2;
        }
      }
      if (y1 < y2) {
        if (yy2 > y2) {
          yy2 = y2;
        }
      }

      line(xx1, yy1, xx2, yy2);
      currentPos = currentPos + lPercent + gPercent;
    }
  }
}
