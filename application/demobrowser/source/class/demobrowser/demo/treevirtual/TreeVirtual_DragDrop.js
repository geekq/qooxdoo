/**
 * Demonstrate drag &amp; drop in a TreeVirtual.
 */
qx.Class.define("demobrowser.demo.treevirtual.TreeVirtual_DragDrop",
{
  extend : qx.application.Standalone,

  members :
  {
    main : function()
    {
      this.base(arguments);
  
      //
      // Initialization
      //
      
      // Provide convenience methods
      qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                       qx.ui.treevirtual.MNode);
                       
      // Provide Drag and Drop support
      qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                       qx.ui.treevirtual.MDragAndDropSupport);
      
      //
      // First tree
      //
  
      var tree1 = new qx.ui.treevirtual.TreeVirtual(["Tree 1"]);
      tree1.set(
        {
          decorator : "pane",
          backgroundColor : "white"
        });
      tree1.setAlwaysShowOpenCloseSymbol(true);
  
      // Add the tree1 to the document
      this.getRoot().add(
        tree1,
        {
          left   : 10,
          width  : "30%",
          top    : 0,
          bottom : 0
        });
                 
      tree1.addToDocument();
  
      /**** tree nodes ****/
  
      var dataModel1 = tree1.getDataModel();
      var te1 = dataModel1.addBranch(null, "Desktop", true);
      tree1.setNodeType(te1, "Folder");
      var te1_1 = dataModel1.addBranch(te1, "Files", true);
      tree1.setNodeType(te1_1, "Folder");
      var te1_2 = dataModel1.addBranch(te1, "Workspace", true);
      tree1.setNodeType(te1_2, "Folder");
      
      var te2 = dataModel1.addBranch(null, "Inbox", true);
      tree1.setNodeType(te2,"Folder");
      for (var i = 1; i < 5; i++)
      {
        var m = dataModel1.addLeaf(te2, "Message #" + i);
        tree1.setNodeType(m,"Message");
      }    
      
      var te2_2 = dataModel1.addBranch(te2, "No Spam here", true);
      tree1.setNodeType(te2_2, "NoSpamFolder");
      
      var te2_1 = dataModel1.addBranch(te2, "Spam", true);
      tree1.setNodeType(te2_1, "Folder");
      
      for (var i = 1; i < 10; i++)
      {
        var spam = dataModel1.addLeaf(te2_1, "Spam Message #" + i);
        tree1.setNodeType(spam,"Spam");
      }
      // render nodes
      dataModel1.setData();
  
      /**** drag & drop support ****/
  
      tree1.setAllowDragTypes(["*"]);
      tree1.setAllowDropBetweenNodes(true);
      tree1.setAllowDropTypes([
          ['Spam','Folder'], ['Message','Folder'],['Folder','Folder'],['Message','NoSpamFolder']
      ]);  
      
      // move node on drop
      tree1.addListener("dragdrop",function(event){  
        // move node to new place
        this.moveNode(this.getDropData(event));
      },tree1);
      
      // auto-select node on hover timout
      tree1.addListener("draghover",function(event){
        var row= event.getData().row;
        this.getSelectionModel().setSelectionInterval(row,row);
      },tree1);
      
      tree1.setEnableDragDrop(true); // this must be the last property set
      
      //
      // Second tree
      //
      
      var tree2 = new qx.ui.treevirtual.TreeVirtual(["Tree 2"]);
      tree2.set({
              left   : "32%",
              width  : "30%",
              top    : 0,
              bottom : 0,
              border : "inset-thin",
              backgroundColor : "white"
            });
      tree2.setAlwaysShowOpenCloseSymbol(true);
  
      // Add the tree to the document
      tree2.addToDocument();
  
      /*** add nodes ****/
      
      var dataModel2 = tree2.getDataModel();
      var dropNode = dataModel2.addBranch(null, "Drop here", true);
      tree2.setNodeType(dropNode,"Folder");
      var dropNode2 = dataModel2.addBranch(dropNode, "Or here", true);
      tree2.setNodeType(dropNode2,"Folder");
      
      for(var i=1; i<11; i++)
      {
        var f = dataModel2.addBranch(dropNode, "Some Folder #" + i, true);
        tree2.setNodeType(f,"Folder");
      }
      
      // render 
      dataModel2.setData();
      
      /**** drag & drop support ****/
      
      tree2.setAllowDragTypes(['Message','Folder']);
      tree2.setAllowDropTypes([['*','Folder']]);
      tree2.setSortAfterDrop(true);
      tree2.setSortChildNodesBy({
        'dragType' : ['Folder','Message','Spam'], // dragType is alias for data.MDragAndDropSupport.type
        'label' : "asc"
      });
     
      // on drop, move node and sort parent (this is done automatically through setSortAfterDrop(true)
      tree2.addListener("dragdrop",function(event){  
        this.moveNode(this.getDropData(event));
      },tree2);
  
      tree2.setEnableDragDrop(true);
      
      //
      // Command Frame
      //
      
      var commandFrame = new qx.ui.groupbox.GroupBox("Control");
      commandFrame.set({ top: 5, right: 5, left: "70%", bottom: 5 });
      commandFrame.addToDocument();
  
      var o = new qx.ui.basic.Atom("Current Selection: ");
      o.set({ left: 0, top: 6 });
      commandFrame.add(o);
  
      o = new qx.ui.form.TextField();
      o.set({ left: 4, right: 0, top: 20, readOnly: true });
      commandFrame.add(o);
      tree1.addListener("changeSelection",function(e){
        // Get the list of selected nodes.  We're in single-selection mode, so
        // there will be only one of them.
        var nodes = e.getData();
        if (! nodes[0])return;
        this.setValue(tree1.getHierarchy(nodes[0].nodeId).join('/'));
        buttonRemove.setEnabled(true);
      },o);
  
      var buttonRemove = new qx.ui.form.Button("Remove");
      buttonRemove.set({ top: 42, left: 0, enabled: false });
      commandFrame.add(buttonRemove);
      buttonRemove.addListener("execute",function(e){
        selectedNodes = tree1.getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; i++)
        {
          dataModel1.prune(selectedNodes[i].nodeId, true);
          dataModel1.setData();
        }
      });
  
      o = new qx.ui.form.CheckBox("Tree 1: Allow drop between nodes?");
      o.set({ top: 80, left: 0, checked: true });
      commandFrame.add(o);
      o.addListener("changeChecked",function(e){
         tree1.setAllowDropBetweenNodes(e.getData());
       });
  
      o = new qx.ui.form.CheckBox("Tree 1: Autoselect after timeout?");
      o.set({ top: 100, left: 0, checked: true });
      commandFrame.add(o);
      o.addListener("changeChecked",function(e){
       tree1.setDragHoverTimeout(e.getData()?1000:null);
      });
  
      o = new qx.ui.form.CheckBox("Tree2: Sort after Drop?");
      o.set({ top: 120, left: 0, checked: true });
      commandFrame.add(o);
      o.addListener("changeChecked", function(e){
       tree2.setSortAfterDrop(e.getData());
      });
  
      o = new qx.ui.form.CheckBox("Display a row focus indicator?");
      o.set({ top: 140, left: 0, checked: true });
      commandFrame.add(o);
      o.addListener("changeChecked",function(e){
       tree1.setShowRowFocusIndicator(e.getData());
       tree2.setShowRowFocusIndicator(e.getData());
      });
  
      o = new qx.ui.form.CheckBox("Display a cell focus indicator?");
      o.set({ top: 160, left: 0, checked: true });
      commandFrame.add(o);
      o.addListener("changeChecked", function(e){
        tree1.setShowCellFocusIndicator(e.getData());
        tree2.setShowRowFocusIndicator(e.getData());      
      });
    }
  }
});
