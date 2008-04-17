/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("demobrowser.demo.layout.StackLayout_2",
{
  extend : qx.application.Standalone,

  members :
  {
    main: function()
    {
      this.base(arguments);

      var containerLayout = new qx.ui.layout.HBox();
      containerLayout.setSpacing(20);

      var container = new qx.ui.core.Composite(containerLayout);
      this.getRoot().addMain(container);



      // "normal" size, auto-sized, one limited child
      var stack1 = new qx.ui.layout.Stack();
      var widget1 = (new qx.ui.core.Composite(stack1)).set({decorator: "black", backgroundColor: "yellow"});

      var list1 = [];
      list1[0] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "red", height: 300});
      list1[1] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "blue", minWidth: 150});
      list1[2] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "orange", width: 200});
      list1[3] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green", maxWidth : 50});
      list1[4] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "fuchsia"});

      for (var i=0; i<widgets1.length; i++) {
        widget1.add(list1[i]);
      }
      stack1.setSelected(list1[0]);

      container.add(widget1);

      widget1.addListener("click", function(e)
      {
        var current = list1.indexOf(e.getTarget())+1;
        if (current === list1.length || current === -1) {
          current = 0;
        }
        stack1.setSelected(widget1.getChildren()[current]);
      });



      // resize to selected, auto-sized, one limited child
      var stack2 = new qx.ui.layout.Stack();
      stack2.setResizeToSelected(true);
      var widget2 = (new qx.ui.core.Composite(stack2)).set({decorator: "black", backgroundColor: "yellow"});

      var list2 = [];
      list2[0] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "red", height: 300});
      list2[1] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "blue", maxHeight : 20});
      list2[2] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "orange", width: 200});
      list2[3] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "green"});
      list2[4] = (new qx.ui.core.Widget).set({decorator: "black", backgroundColor: "fuchsia"});

      for (var i=0; i<list2.length; i++) {
        widget2.add(list2[i]);
      }

      stack2.setSelected(list1[2]);

      widget2.addListener("click", function(e)
      {
        var current = list2.indexOf(e.getTarget())+1;
        if (current === list2.length || current === -1) {
          current = 0;
        }
        stack2.setSelected(widget2.getChildren()[current]);
      });

      container.add(widget2);
    }
  }
});
