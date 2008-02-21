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

qx.Class.define("demobrowser.demo.ui.HBoxLayout_5",
{
  extend : demobrowser.Demo,

  members :
  {
    main: function()
    {
      this.base(arguments);

      doc = new qx.ui.root.Application(document);

      doc.setTextColor("black");
      doc.setBackgroundColor("white");

      var border = new qx.ui.decoration.Basic(1, "solid", "black");



      // one percent child which is not flexible
      var box1 = (new qx.ui.core.Widget).set({width: 500, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, { width: "50%" });
      layout1.add(w2, { flex : 1 });
      layout1.add(w3, { flex : 1 });

      box1.setLayout(layout1);
      doc.add(box1, 10, 10);




      // all percent child, using 90% in sum, rest filled via flex
      var box1 = (new qx.ui.core.Widget).set({width: 500, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "30%", flex: 1});
      layout1.add(w2, {width: "30%", flex: 1});
      layout1.add(w3, {width: "30%", flex: 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 70);




      // all percent child, using 99.9% in sum, flex disabled (=> to small result)
      var box1 = (new qx.ui.core.Widget).set({width: 500, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33.3%"});
      layout1.add(w2, {width: "33.3%"});
      layout1.add(w3, {width: "33.3%"});

      box1.setLayout(layout1);
      doc.add(box1, 10, 130);




      // all percent child, using 99.9% in sum, flex enabled for last child (=> perfect result, last one a bit bigger)
      var box1 = (new qx.ui.core.Widget).set({width: 500, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33.3%"});
      layout1.add(w2, {width: "33.3%"});
      layout1.add(w3, {width: "33.3%", flex : 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 190);






      // one percent child which is not flexible + auto sizing
      var box1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "50%"});
      layout1.add(w2, {flex: 1});
      layout1.add(w3, {flex: 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 250);



      // all child in percents + auto sizing + no flex
      var box1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33.3%"});
      layout1.add(w2, {width: "33.3%"});
      layout1.add(w3, {width: "33.3%"});


      box1.setLayout(layout1);
      doc.add(box1, 10, 310);


      // all child in percents + auto sizing + flex enabled
      var box1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33%", flex: 1});
      layout1.add(w2, {width: "33%", flex: 1});
      layout1.add(w3, {width: "33%", flex: 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 370);




      // all child in percents + flex enabled (shrinking)
      var box1 = (new qx.ui.core.Widget).set({width : 200, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33%", flex: 1});
      layout1.add(w2, {width: "33%", flex: 1});
      layout1.add(w3, {width: "33%", flex: 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 430);





      // all child in percents + flex enabled (growing)
      var box1 = (new qx.ui.core.Widget).set({width : 500, decorator: border, backgroundColor: "yellow"});
      var layout1 = new qx.ui.layout.HBox();

      layout1.setSpacing(5);

			var w1 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w2 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});
			var w3 = (new qx.ui.core.Widget).set({decorator: border, backgroundColor: "green"});

      layout1.add(w1, {width: "33%", flex: 1});
      layout1.add(w2, {width: "33%", flex: 1});
      layout1.add(w3, {width: "33%", flex: 1});

      box1.setLayout(layout1);
      doc.add(box1, 10, 490);
    }
  }
});
