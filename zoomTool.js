let zoomMode; //global value to determine if zoomed or not
let lastScale = { x: 0, y: 0, w: 0, h: 0 };
class ZoomTool {
  zoomButton;
  unzoomButton;
  cvSize = select("#content").size();

  constructor() { 
    zoomMode = getItem("zoomMode") || false; //get item from local Storage
    //set an icon and a name for the object
    this.icon = "assets/zoom.jpg";
    this.name = "zoomTool";
    this.description = `The zoom tool can be used by dragging the mouse on the canvas and then clicking the zoom button`;
    this.message = "";
    this.selectScale = { x: 0, y: 0, w: 0, h: 0 };
    this.img = [];
    this.prevPixel = [{ pixel: null, width: null, height: null }];
    this.zoomed = false;
    this.pressed = false;
    this.unZoomPressed = false;
    this.mouseIsDrag = false;
    this.UnpopulatePressed = false;
    this.noHistory = true;


    this.draw = () => {
      updatePixels();
      if (
        mouseIsPressed &&
        zoomMode === false &&
        mouseX > 5 &&
        mouseY < height - 10 &&
        this.pressed === true
      ) { //allow selecting area to zoom
        noFill();
        stroke(0);
        rect(
          this.selectScale.x,
          this.selectScale.y,
          this.selectScale.w,
          this.selectScale.h
        );
      }
    };

    this.populateOptions = () => {
      loadPixels();

      cursor("assets/zoomC.png", 30, 30);

      //add the zoom controls
      this.zoomButton = createButton("Zoom");
      this.unzoomButton = createButton("Unzoom");
      this.zoomButton.parent(Gopt);
      this.unzoomButton.parent(Gopt);
      this.UnpopulatePressed = false;
      if (zoomMode) {
        this.zoomButton.attribute("disabled", "");
      } else {
        this.unzoomButton.attribute("disabled", "");
      }

      this.zoomButton.mousePressed(() => {
        this.zoomAction();
      });

      this.unzoomButton.mousePressed(() => {
        this.unZoomAction();
      });
    };

    this.mousePressed = () => {
      if (this.unZoomPressed && this.mouseIsDrag) {
        this.mouseIsDrag = false;
        this.unZoomPressed = false;
        this.mousePressed();
        return;
      }

      if (mouseX > 5 && mouseY < height - 15) {
        this.selectScale.x = mouseX;
        this.selectScale.y = mouseY;
        this.pressed = true;
      }

      if (zoomMode === true) {
        this.unZoomAction()
      }
      this.message = ""
    };

    this.mouseDragged = () => {
      if (this.unZoomPressed === true) {
        this.mouseIsDrag = true;
        return;
      }

      if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        let w = mouseX - this.selectScale.x;
        let h = mouseY - this.selectScale.y;

        this.selectScale.w = w;
        this.selectScale.h = h;
      }
    };

    this.mouseReleased = () => {
      updatePixels();

      if (

        JSON.stringify(this.selectScale) !== JSON.stringify(lastScale)
      ) {
        this.zoomAction();

        lastScale = this.selectScale;
      }
    };

    this.unselectTool = () => {
      this.UnpopulatePressed = true;
      let color = select("#color").value();
      fill(color);
      stroke(color);
      cursor();
    };
  }

  zoomAction() {
    //what get's called to zoom the canvas

    this.cvSize = select("#content").size();

    if (width === this.cvSize.width * 2 || height === this.cvSize.height * 2) {
      this.zoomButton.attribute("disabled", "");
      this.unzoomButton.removeAttribute("disabled");
      zoomMode = true;
      storeItem("zoomMode", zoomMode);
      cursor("zoom-out");
      return;
    }
    if (
      this.UnpopulatePressed ||
      this.selectScale.x < 0 ||
      this.selectScale.y < 0 ||
      this.selectScale.w < 0 ||
      this.selectScale.h < 0
    ) {
      this.message = "Please drag on the canvas to zoom"
      return;
    }

    if (zoomMode) {
      return;
    }

    this.zoomButton.attribute("disabled", "");

  
    let gotten = get();
    this.img.push(gotten);
    
    loadPixels();



    resizeCanvas(width * 2, height * 2);
    fill(255);
    rect(0, 0, width, height);
    loadPixels();
    scale(2);
    image(gotten, 0, 0);
    loadPixels();

    zoomMode = true;
    storeItem("zoomMode", zoomMode);
    cursor("zoom-out");
    this.unzoomButton.removeAttribute("disabled");
   
  }

  unZoomAction() {
    //action to unzoom
    if (width === this.cvSize.width || height === this.cvSize.height) {
      this.zoomButton.removeAttribute("disabled");
      this.unzoomButton.attribute("disabled", "");
      zoomMode = false;
      storeItem("zoomMode", zoomMode);
      cursor("assets/zoomC.png", 30, 30);
      return;
    }
    this.prevPixel[0].width = width;
    this.prevPixel[0].height = height;
    this.prevPixel[0].pixel = get();
    loadPixels();

    resizeCanvas(width / 2, height / 2, true);
    fill(255);
    rect(0, 0, width, height);
    loadPixels();

    scale(1);
    image(this.prevPixel[0].pixel, 0, 0, width, height);

    loadPixels();
    this.zoomButton.removeAttribute("disabled");
    this.unzoomButton.attribute("disabled", "");

    zoomMode = false;
    storeItem("zoomMode", zoomMode);
    cursor("assets/zoomC.png", 30, 30);

    mouseIsPressed = false;
    this.unZoomPressed = true;

    this.selectScale = { x: -width, y: -height, w: -width, h: -height };
  }
}
