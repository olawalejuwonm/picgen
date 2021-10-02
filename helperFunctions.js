//Global variable that can be accessed throughoutb the application
let HistoryClose;
let undobtn;
let redobtn;
let historyBtn;
class HelperFunctions {
  constructor() {
    //p5.dom click click events. Notice that there is no this. at the
    //start we don't need to do that here because the event will
    //be added to the button and doesn't 'belong' to the object

    //initialize
    let dC = select("#defaultCanvas0");
    undobtn = select("#undoButton");
    redobtn = select("#redoButton");
    let historyMode = false;
    historyBtn = select("#History");
    let HistoryDiv = createDiv("").style("background-color: #EFEFEF;");

    //Function that asynchronously store drawing state to local storage
    this.awaitSave = async () => {
      let getDataUrl = () => {
        let dataURL = dC.elt.toDataURL("image/png");
        storeItem("pixels", dataURL);
        mes.html("All changes saved locally");
      };

      let mes = select("#stateMes");
      mes.html("Saving....");
      setTimeout(() => {
        getDataUrl();
      }, 1000);
    };

    //close history , if opened initially
    HistoryClose = () => {
      historyBtn.html("Layer History");
      historyMode = false;
      HistoryDiv.hide();
    };

    //the function determines whether to enable undo/redo and layer button
    //because of some like text tool that repeatedly make changes to the pixel
    //in their draw function.
    this.ButtonStates = () => {
      if (undoArr.length !== 0) {
        //generate pixel
        undoArr = undoArr.map((obj) => {
          //loop through undoArr to generate pixel because local storage can't
          //store circular that return from get function
          //so this will generate the p5.Image that can't be stored in local
          //storage
          let pixel = loadImage(obj.url);
          return { ...obj, pixel };
        });
        undobtn.removeAttribute("disabled");
        historyBtn.removeAttribute("disabled");
      } else {
        undobtn.attribute("disabled", "");
      }

      if (redoArr.length !== 0) {
        //loop through redoArr to generate pixel because local storage can't
        //store circular that return from get function
        //so this will generate the p5.Image that can't be stored in local
        //storage
        redoArr = redoArr.map((obj) => {
          let pixel = loadImage(obj.url);
          return { ...obj, pixel };
        });
        redobtn.removeAttribute("disabled");
        historyBtn.removeAttribute("disabled"); //enable history button
      } else {
        redobtn.attribute("disabled", "");
      }
    };

    this.ButtonStates();

    this.getPixels = () => {
      //This will generate the pixel date to be used for layer history,
      //the pixel which is p5.image to be rendered when undo is clicked,
      //url for the purpose of local storage that can't store circular
      let date = new Date();

      undoArr.push({
        date:
          date.getDate() +
          "/" +
          date.getMonth() +
          "/" +
          date.getFullYear() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds(),
        pixel: get(),
        url: dC.elt.toDataURL("image/png"),
      });

      let storeArr = [];
      undoArr.map((a) => {
        //loop through
        if (storeArr.length > 14) {
          //reduce maximum number of history in localStorage beacause of
          //performance
          storeArr.splice(0, 1);
        }
        //strip out get() from the Array of object because it's a circular and
        // it can't be stored in local storage
        storeArr.push({ date: a.date, url: a.url });
      });
      storeItem("undoArr", storeArr);
      undobtn.removeAttribute("disabled");
      historyBtn.removeAttribute("disabled");
    };

    //handle when Layer History is clicked
    historyBtn.mouseClicked(() => {
      HistoryDiv.html("Canvas History");
      let historyArr = undoArr.concat(redoArr); //join the two array  to make history

      if (historyArr.length === 0) {
        HistoryDiv.html("<br>No History At The Moment", true);
      } else {
        HistoryDiv.html("<br>Click On A Date Below \n<br>", true);
      }
      historyArr.forEach((a, i) => {
        //loop through history array
        let button = createButton(a.date, i); //i bears the index of current
        //iteration
        button.style("display:block;color:#444;margin-bottom: 5px");
        button.mousePressed(() => {
          resizeCanvas(width, height); //resize canvas to display the image
          image(historyArr[i].pixel, 0, 0, width, height);
        });
        button.parent(HistoryDiv);
      });

      HistoryDiv.position(windowWidth - 200, 0);
      HistoryDiv.show();

      if (historyMode === false) {
        historyBtn.html("Close History");
        historyMode = true;
        HistoryDiv.show();
      } else {
        historyBtn.html("Layer History");
        historyMode = false;
        HistoryDiv.hide();
      }
    });

    //event handler for the clear button event. Clears the screen
    select("#Reload").mouseClicked(() => {
      this.clearCanvas(true);
    });

    this.clearCanvas = (reload) => {
      const clearAll = () => {
        background(255, 255, 255);
        resizeCanvas(
          select("#content").size().width,
          select("#content").size().height
        );
        clear();
        clearStorage();
        select("#img").elt.value = null;
        imageB.img = null;
        storeItem("zoomMode", false);
        removeItem("pixels");
        zoomMode = false;
        undoArr = [];
        redoArr = [];
        //call loadPixels to update the drawing state
        //this is needed for the mirror tool
        loadPixels();
      };
      if (reload) {
        //To ease usabilty and make user aware they are about to perform
        //destructive activity
        let ans = confirm("This will clear the drawing state. Continue?");
        if (ans) {
          clearAll();
        }

        // window.location.reload();
      } else {
        clearAll();
      }
    };

    //event handler for the save image button. saves the canvsa to the
    //local file system.
    select("#saveImageButton").mouseClicked(function () {
      saveCanvas("myDrawing.png");
    });


    //event on mouseclick for undo button
    // just like getPixel above
    undobtn.mouseClicked(() => {
      let date = new Date();
      let undoL = undoArr.length;

      if (undoL > 0) {
        redoArr.push({
          date:
            date.getDate() +
            "/" +
            date.getMonth() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds(),
          pixel: get(),
          url: dC.elt.toDataURL("image/png"),
        });
        let storeArr = [];
        redoArr.map((a) => {
          if (storeArr.length > 14) {
            //reduce maximum number of history in local storage
            storeArr.splice(0, 1);
          }
          //strip out get() from the Array of object because it's a circular and it can't be stored in local storage
          storeArr.push({ date: a.date, url: a.url });
        });
        storeItem("redoArr", storeArr);
        redobtn.removeAttribute("disabled");
        clear();
        image(undoArr[undoL - 1].pixel, 0, 0, width, height);
        undoArr.splice(undoL - 1, 1);
        this.awaitSave();
      }
      if (undoArr.length === 0) {
        undobtn.attribute("disabled", "");
      }
    });


     //event on mouseclick for redo button
    // just like getPixel above
    redobtn.mouseClicked(function () {
      var redoL = redoArr.length;

      if (redoL > 0) {
        let date = new Date();
        undoArr.push({
          date:
            date.getDate() +
            "/" +
            date.getMonth() +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes() +
            ":" +
            date.getSeconds(),
          pixel: get(),
          url: dC.elt.toDataURL("image/png"),
        });
        let storeArr = [];
        undoArr.map((a) => {
          if (storeArr.length > 14) {
            //reduce maximum number of history in local storage
            storeArr.splice(0, 1);
          }
          //strip out get() from the Array of object because it's a circular and it can't be stored in local storage
          storeArr.push({ date: a.date, url: a.url });
        });
        storeItem("undoArr", storeArr);
        undobtn.removeAttribute("disabled");

        image(redoArr[redoL - 1].pixel, 0, 0);
        redoArr.splice(redoL - 1, 1);
        this.awaitSave();
      }
      if (redoArr.length === 0) {
        redobtn.attribute("disabled", true);
      }
    });
  }
}
