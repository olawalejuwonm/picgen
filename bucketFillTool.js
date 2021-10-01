class BucketFillTool {
  constructor() {
    //set an icon and a name for the object
    this.icon = "assets/bucket.jpg";
    this.name = "bucketFillTool";
    this.description =
      "The bucket fill tool can be used by clicking/pressing inside of an enclosed shape. Selected color will be used as the fill color. Press the smooth button and press and hold on the canvas to perfect the filled color.";
    this.message = "";
    this.smooth = false;
    this.smoothBtn;
    this.draw = function () {
      if (this.smooth === true) {
        if (mouseIsPressed) {
          fill(c);
          stroke(c);
          ellipse(mouseX, mouseY, 10);
        }
      }
    };

    this.populateOptions = () => {
      //populate button and set cursor
      cursor("assets/cursorBucket.png", 30, 30);
      this.smoothBtn = createButton("Smooth");
      this.smoothBtn.mousePressed(() => {
        if (this.smooth) {
          this.smoothBtn.html("Smooth");
        } else {
          this.smoothBtn.html("End Smooth");
        }

        this.smooth = !this.smooth;
      });

      this.smoothBtn.parent(Gopt);
    };

    this.mouseReleased = () => {
      cursor("assets/cursorBucket.png", 30, 30);
    };

    this.unselectTool = () => {
      cursor();
    };

    this.mousePressed = function () {
      this.message = "";
      let color = select("#color");
      //convert the hex color value to rgb so that it can be matched with pixel
      color = this.hexToRgb(color.value());
      loadPixels();

      if (this.smooth) {
        return;
      }

    //Get rgb color of surrounding pixel with respect to value of mouse position
    //if the canvas is white it'll result in 255
      let r = pixels[(mouseY * width + mouseX) * 4];
      let g = pixels[(mouseY * width + mouseX) * 4 + 1];
      let b = pixels[(mouseY * width + mouseX) * 4 + 2];
      if (r === 0 && g === 0 && b === 0) { //handle unusual behavior usually when image is on canvas
        let text =
          "Pixel is empty, Save the canvas and clear it or  use smooth";
        this.message = text;
        cursor("not-allowed");
      }
      if ( //handle unusual behavior usually when image is on canvas
        typeof r === "undefined" ||
        typeof g === "undefined" ||
        typeof b === "undefined"
      ) {
        let text =
          "Pixel is empty, Save the canvas and clear it or  use smooth";
        this.message = text;

        cursor("not-allowed");
      }
      if (r === color.r || g === color.g || b === color.b) { 
        //handle when user is trying to fill with same color
        cursor("not-allowed");
        let text = "You cannot fill a pixel with the same color";
        this.message = text;
      } else if (r <= 255 || r >= 200) {
        bucket(mouseX, mouseY, 0, color.r, color.g, color.b, r, g, b);
      }
      updatePixels();
    };
  }

  hexToRgb(hex) { //function to convert hex value to rgb for pixel using regex
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : {};
  }
}


//function to fill, following the flood fill algorithm
function bucket(x, y, ii, R, G, B, ro, go, bo) {
  let max = 1;

  if (max > 7000) {
    max = 0;
    return;
  } else {
    max += 1;
  }

  if (ii > 1000) {
    return;
  }
  let r = pixels[(y * width + x) * 4];
  let g = pixels[(y * width + x) * 4 + 1];
  let b = pixels[(y * width + x) * 4 + 2];

  if (r == ro && g == go && b == bo) {
    pixels[(y * width + x) * 4] = R;
    pixels[(y * width + x) * 4 + 1] = G;
    pixels[(y * width + x) * 4 + 2] = B;

    for (let i = -1; i <= 1; i++) {
      if (i == 0) continue;
      if (x + i >= width) break;
      if (x + i < 0) break;
      bucket(x + i, y, ii + 1, R, G, B, ro, go, bo);
    }
    for (let i = -1; i <= 1; i++) {
      if (i == 0) continue;
      if (y + i >= width) break;
      if (y + i < 0) break;
      bucket(x, y + i, ii + 1, R, G, B, ro, go, bo);
    }
  }
}
