class CanvasImage {
  constructor() {
    this.img = null;
    let input;
    this.editBtn = null;
    this.editMode = false;

    const getLastItem = (thePath) =>
      thePath.substring(thePath.lastIndexOf("/") + 1);
    let path = getLastItem(window.location.pathname);
    // console.log( path, path.length);
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    if (path.length) {
      AppMode = select("#AppOpt");
      select("#saveApp").mousePressed(()=> {
        saveCanvas(path.split(".")[0] + ".png")
      })
      SaveWithoutAsync = true;

      loadImage("assets/birthday.jpg", (img) => {
        resizeCanvas(img.width, img.height);
        image(img, 0, 0, img.width, img.height);
      });

      let preview = select("#preview");
      let dC = select("#content");
      preview.mousePressed(() => {
        if (preview.html() == "Hide Image") {
          // AppMode.removeAttribute("style")
          dC.attribute(
            "style",
            `position: absolute;
         top: -9999px;
         left: -9999px;`
          );
          preview.html("Preview Image");
        } else {
          // AppMode.attribute("style", "background-color: #444;color:white")
          dC.removeAttribute("style");
          preview.html("Hide Image");
        }
      });

      select("#file").input((f) => {
        getBase64(f.target.files[0])
          .then((d) => {
            loadImage(d, (img) => {
              let shape = createGraphics(img.width, img.height);
              // img.resize(width, height)
              // shape.ellipse(535, 540,615,596)
              shape.ellipse(
                img.width / 2,
                img.height / 2,
                img.width,
                img.height
              );

              img.mask(shape);

              // image(img, 535, 540,615,596)
              image(img, 233, 245, 615, 596);
            });
          })
          .catch((e) => {
            alert(e.message);
          });
      });

      let btn1 = select("#date");
      let btn2 = select("#name");

      btn1.mousePressed((e) => {
        if (!toolbox.selectedTool.textMode) {
          toolbox.selectTool("TextTool");
          let datePixel = { x: 476, y: 1005.6666870117188, w: 295, h: 44 };
          toolbox.selectedTool.selectScale = datePixel;
          toolbox.selectedTool.mouseReleased();
        }

        console.log(e);
      });
      btn2.mousePressed(() => {
        if (!toolbox.selectedTool.textMode) {
          toolbox.selectTool("TextTool");
          let namePixel = { x: 327, y: 937.6666870117188, w: 470, h: 52 };
          toolbox.selectedTool.selectScale = namePixel;
          toolbox.selectedTool.mouseReleased();
        }
      });
    }

    //Canvas Image Set An Image As Background of the canvas.
    //It also set the width and height of the canvas approximately to the image size

    //handleFile
    input = createFileInput((file) => {
      if (file.type === "image") {
        loadImage(
          file.data,
          (img) => {
            resizeCanvas(img.width * 2, img.height * 2);
            image(img, 20, 20, width - 30, height - 30);
            this.img = img;
            this.handleEdit();
          },
          (e) => {
            alert("Unable To Load Image");
          }
        );
      } else {
        alert("Please Select An Image");
        this.img = null;
      }
    });
    input.attribute("accept", "image/*");
    input.attribute("id", "img");
    input.parent("#initOpt");

    if (AppMode) {
      input.hide();
    }
  }

  //Apply filter to the image when edit button is pressed
  handleEdit() {
    if (this.img) {
      this.editBtn = createButton("Blur Image");
      this.editBtn.parent("#initOpt");
    }
    this.editBtn.mousePressed(() => {
      if (!this.editMode) {
        helpers.getPixels();

        loadPixels();
        noFill();

        this.img.filter(BLUR, 3);

        image(this.img, 20, 20, width - 30, height - 30);

        this.editBtn.attribute("disabled", "");
        this.editMode = true;
      } else {
        image(this.img, 20, 20, width - 30, height - 30);
        this.editBtn.html("Blur Image");
        this.editMode = false;
      }
    });
  }
}
