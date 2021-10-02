//container object for storing the tools. Functions to add new tools and select a tool
function Toolbox() {
  var self = this;

  this.tools = [];
  this.selectedTool = null;

  var toolbarItemClick = function () {
    //remove any existing borders
    var items = selectAll(".sideBarItem");
    for (var i = 0; i < items.length; i++) {
      items[i].style("border", "0");
    }

    var toolName = this.id().split("sideBarItem")[0];
    self.selectTool(toolName);

    //call loadPixels to make sure most recent changes are saved to pixel array
    loadPixels();
  };

  //add a new tool icon to the html page
  var addToolIcon = function (icon, name) {
    var sideBarItem = createDiv("<img src='" + icon + "'></div>");
    sideBarItem.class("sideBarItem");
    sideBarItem.id(name + "sideBarItem");
    sideBarItem.parent("sidebar");
    sideBarItem.mouseClicked(toolbarItemClick);
  };

  //add a tool to the tools array
  this.addTool = function (tool) {
    //check that the object tool has an icon and a name
    if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
      alert("make sure your tool has both a name and an icon");
    }
    this.tools.push(tool);

    addToolIcon(tool.icon, tool.name);
    //if no tool is selected (ie. none have been added so far)
    //make this tool the selected one.
    if (this.selectedTool == null) {
      this.selectTool(tool.name);
    }
  };

  this.selectTool = function (toolName) {
    //search through the tools for one that's name matches
    //toolName

    for (var i = 0; i < this.tools.length; i++) {
      if (this.tools[i].name == toolName) {
        //if the tool has an unselectTool method run it.

        //order matters
        if (this.selectedTool != null) {
          Gopt.html(""); //called this once to clear option field, since it appears mostly
          //in unslect tools of most tools

         
          if (this.selectedTool.hasOwnProperty("unselectTool")) {
            this.selectedTool.unselectTool();
          }
        }

        //select the tool and highlight it on the toolbar
        this.selectedTool = this.tools[i];

         //mostly called to restore state
         fill(c);
         stroke(sc);
         strokeWeight(sw);
         helpers.ButtonStates();
         cursor("auto");
        if (this.selectedTool.noHistory) { //if there's no history 
          //diable undo/redo and layer history
          undobtn.attribute("disabled", "");
          redobtn.attribute("disabled", "");
          historyBtn.attribute("disabled", "");
        }
        select("#" + toolName + "sideBarItem").style(
          "border",
          "2px solid blue"
        );

        //if the tool has an options area. Populate it now.
        if (this.selectedTool.hasOwnProperty("populateOptions")) {
          this.selectedTool.populateOptions();
        }

        //to display information about each tool
        if (select("#info")) {
          if (!AppMode) {
            select("#info").html(this.selectedTool.description || "");

          }
          
        }
      }
    }
  };
}
