/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Volker Pauli (vpauli)
     * Sebastian Werner (wpbasti)
     * Carsten Lergenmueller (carstenL)

 ************************************************************************ */

/* *************************************************************************

#module(ui_splitpane)

************************************************************************* */

/**
 * @appearance splitpane-splitter
 * @state vertical
 * @state horizontal
 */
qx.Class.define("qx.ui.splitpane.SplitPaneSplitter",
{
  extend : qx.ui.layout.CanvasLayout,

  construct : function(pane)
  {
    this.base(arguments);

    this.setStyleProperty("fontSize", "0px");
    this.setStyleProperty("lineHeight", "0px");
    this._pane = pane;
  },

  properties :
  {
    appearance :
    {
      refine : true,
      init : "splitpane-splitter"
    }
  },

  destruct : function() {
    this._disposeObjects("_pane");
  }
});
