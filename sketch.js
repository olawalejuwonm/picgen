//global variables that will store the toolbox colour palette
//and the helper functions
// ssw
let toolbox = null;
let colourP = null;
let helpers = null;
let Gopt = null;
let imageB = null;
let canvasContainer = null;
let savedImg = {};
let fonts = {};
let savedPixels;// localStorage pixels
let AppMode;
let undoArr; //store undoArr
let redoArr; //store redoArr
let message; //uidance message
function preload() {
  fonts = {
    Arial: "Arial",
    Courier: "Courier New",
    Georgia: "Georgia",
    TNR: "Times New Roman",
    TMS: "Trebuchet MS",
    Verdana: "Verdana",
  };

}

let SaveWithoutAsync = false


let noHistory = false;
function setup() {
  //create a canvas to fill the content div from index.html
  //get values needed for the application from localStorage
  savedPixels = getItem("pixels");
  undoArr = getItem("undoArr") || [];
  redoArr = getItem("redoArr") || [];
  message = select("#message");
  savedImg = {};

  canvasContainer = select("#content");
  var cnv = createCanvas(
    savedImg.width || canvasContainer.size().width,
    savedImg.height || canvasContainer.size().height
  );
  cnv.parent("content");
  pixelDensity(1);
  Gopt = select("#options"); //Global Variable

  //create a toolbox for storing the tools
  toolbox = new Toolbox();
  //create helper functions and the colour palette and canvasImage
  helpers = new HelperFunctions();
  colourP = new ColourPalette();
  imageB = new CanvasImage();

 

  //add the tools to the toolbox.
  toolbox.addTool(new FreehandTool());
  toolbox.addTool(new LineToTool());
  toolbox.addTool(new SprayCanTool());
  toolbox.addTool(new mirrorDrawTool());
  toolbox.addTool(new StampTool());
  toolbox.addTool(new ScissorsTool());

  toolbox.addTool(new RectangleTool());
  toolbox.addTool(new BucketFillTool());
  toolbox.addTool(new TextTool());
  toolbox.addTool(new ZoomTool());
  toolbox.addTool(new EraserTool());

  if (AppMode) {
    toolbox.addTool(new NoneTool())
    toolbox.selectTool("none")

  }

  background(255);

  if (savedPixels) { // check if user has some existing changes in local storage
    //if true display that image first
    loadImage(savedPixels, (img) => {
      savedImg = img;
      resizeCanvas(savedImg.width, savedImg.height);

      image(img, 0, 0, width, height);
    });
  }

  cnv.mousePressed(function () { //set mousepressed on canvas. So it 
    //doesn't get called outside canvas
    if (!toolbox.selectedTool.noHistory) {
      // noHistory is no undo or redo
      if (undoArr.length === 0) {
        helpers.getPixels();
      }
    }

    MousePressed();
  });

  cnv.mouseReleased(() => { //set mousereleased on canvas. So it 
    //doesn't get called outside canvas
    MouseReleased();
  });

  cnv.touchEnded(() => { //used as a result from feeback from testers
    MouseReleased();
  });
}

function draw() {
  //call the draw function from the selected tool.
  //hasOwnProperty is a javascript function that tests
  //if an object contains a particular method or property
  //if there isn't a draw method the app will alert the user
  if (toolbox.selectedTool.hasOwnProperty("draw")) {
    toolbox.selectedTool.draw();
    if (message) {
      message.html(toolbox.selectedTool.message || "");
    }
  } else {
    alert("it doesn't look like your tool has a draw method!");
  }
}

function mouseDragged() {
  if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      toolbox.selectedTool.mouseDragged();
    }
  }
}

function keyPressed() {
  if (toolbox.selectedTool.hasOwnProperty("keyPressed")) {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    }
    toolbox.selectedTool.keyPressed();
  }
}

function MousePressed() {
  // not using mousePressed because it get called outside canvas
  if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
    toolbox.selectedTool.mousePressed();
  }
  HistoryClose(); //to close the history
}

function MouseReleased() {
  if (SaveWithoutAsync) {

  }

   else {
    if (!toolbox.selectedTool.noHistory) {
      // noHistory is no undo or redo
      helpers.awaitSave();
      helpers.getPixels();
    } else {
      undobtn.attribute("disabled", "");
      redobtn.attribute("disabled", "");
    }
   }
  if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
    toolbox.selectedTool.mouseReleased();
  }

 
}


