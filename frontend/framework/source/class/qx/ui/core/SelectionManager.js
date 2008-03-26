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
     * Andreas Ecker (ecker)

************************************************************************ */

/**
 * This class represents a selection and manage incoming events for widgets
 * which need selection support.
 */
qx.Class.define("qx.ui.core.SelectionManager",
{
  extend : qx.core.Object,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(vBoundedWidget)
  {
    this.base(arguments);

    this._selectedItems = new qx.ui.core.SelectionStorage(this);

    if (vBoundedWidget != null) {
      this.setBoundedWidget(vBoundedWidget);
    }
  },



  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events:
  {
    /**
     * Fired on a selection change. The "data" proeprty is set to an array of
     * selected items as returned by {@link #getSelectedItems}.
     **/
    "changeSelection" : "qx.event.type.Data"
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** This contains the currently assigned widget (qx.ui.form.List, ...) */
    boundedWidget :
    {
      check : "qx.ui.core.Widget",
      nullable : true
    },


    /** Should multiple selection be allowed? */
    multiSelection :
    {
      check: "Boolean",
      init : true
    },


    /** Enable drag selection? */
    dragSelection :
    {
      check : "Boolean",
      init : true
    },


    /** Should the user be able to select */
    canDeselect :
    {
      check : "Boolean",
      init : true
    },


    /** Should a change event be fired? */
    fireChange :
    {
      check : "Boolean",
      init : true
    },


    /** The current anchor in range selections. */
    anchorItem :
    {
      check : "Object",
      nullable : true,
      apply : "_applyAnchorItem",
      event : "changeAnchorItem"
    },


    /** The last selected item */
    leadItem :
    {
      check : "Object",
      nullable : true,
      apply : "_applyLeadItem",
      event : "changeLeadItem"
    },


    /** Grid selection */
    multiColumnSupport :
    {
      check : "Boolean",
      init : false
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyAnchorItem : function(value, old)
    {
      if (old) {
        this.renderItemAnchorState(old, false);
      }

      if (value) {
        this.renderItemAnchorState(value, true);
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyLeadItem : function(value, old)
    {
      if (old) {
        this.renderItemLeadState(old, false);
      }

      if (value) {
        this.renderItemLeadState(value, true);
      }
    },




    /*
    ---------------------------------------------------------------------------
      MAPPING TO BOUNDED WIDGET
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    _getFirst : function()
    {
      var children = this.getBoundedWidget().getChildren();
      return children[0] || null;
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    _getLast : function()
    {
      var children = this.getBoundedWidget().getChildren();
      return children[children.length-1] || null;
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getFirst : function()
    {
      var vItem = this._getFirst();

      if (vItem) {
        return vItem.getEnabled() ? vItem : this.getNext(vItem);
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getLast : function()
    {
      var vItem = this._getLast();

      if (vItem) {
        return vItem.getEnabled() ? vItem : this.getPrevious(vItem);
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getItems : function() {
      return this.getBoundedWidget().getLayoutChildren();
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getNextSibling : function(vItem) {
      return this.getBoundedWidget().getNextSiblingOf(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getPreviousSibling : function(vItem) {
      return this.getBoundedWidget().getPreviousSiblingOf(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var | null} TODOC
     */
    getNext : function(vItem)
    {
      while (vItem)
      {
        vItem = this.getNextSibling(vItem);

        if (!vItem) {
          break;
        }

        if (this.getItemEnabled(vItem)) {
          return vItem;
        }
      }

      return null;
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var | null} TODOC
     */
    getPrevious : function(vItem)
    {
      while (vItem)
      {
        vItem = this.getPreviousSibling(vItem);

        if (!vItem) {
          break;
        }

        if (this.getItemEnabled(vItem)) {
          return vItem;
        }
      }

      return null;
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem1 {var} TODOC
     * @param vItem2 {var} TODOC
     * @return {boolean} TODOC
     */
    isBefore : function(vItem1, vItem2)
    {
      var cs = this.getItems();
      return cs.indexOf(vItem1) < cs.indexOf(vItem2);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem1 {var} TODOC
     * @param vItem2 {var} TODOC
     * @return {var} TODOC
     */
    isEqual : function(vItem1, vItem2) {
      return vItem1 == vItem2;
    },





    /*
    ---------------------------------------------------------------------------
      MAPPING TO ITEM DIMENSIONS
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param vTopLeft {var} TODOC
     * @return {void}
     */
    scrollItemIntoView : function(vItem, vTopLeft)
    {
      // TODO08: ScrollIntoView support still missing
      // vItem.scrollIntoView(vTopLeft);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getItemOffset : function(vItem) {
      return vItem.getRenderedTop();
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getItemSize : function(vItem) {
      return vItem.getRenderedHeight();
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getItemEnabled : function(vItem) {
      return vItem.getEnabled();
    },




    /*
    ---------------------------------------------------------------------------
      ITEM STATE MANAGMENT
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param vIsSelected {var} TODOC
     * @return {void}
     */
    renderItemSelectionState : function(vItem, vIsSelected)
    {
      vIsSelected ? vItem.addState("selected") : vItem.removeState("selected");

      if (vItem.handleStateChange) {
        vItem.handleStateChange();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param vIsAnchor {var} TODOC
     * @return {void}
     */
    renderItemAnchorState : function(vItem, vIsAnchor)
    {
      vIsAnchor ? vItem.addState("anchor") : vItem.removeState("anchor");

      if (vItem.handleStateChange != null) {
        vItem.handleStateChange();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param vIsLead {var} TODOC
     * @return {void}
     */
    renderItemLeadState : function(vItem, vIsLead)
    {
      vIsLead ? vItem.addState("lead") : vItem.removeState("lead");

      if (vItem.handleStateChange != null) {
        vItem.handleStateChange();
      }
    },




    /*
    ---------------------------------------------------------------------------
      SELECTION HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getItemSelected : function(vItem) {
      return this._selectedItems.contains(vItem);
    },


    /**
     * Make a single item selected / not selected
     *
     * #param vItem[qx.ui.core.Widget]: Item which should be selected / not selected
     * #param vSelected[Boolean]: Should this item be selected?
     *
     * @type member
     * @param vItem {var} TODOC
     * @param vSelected {var} TODOC
     * @return {void}
     */
    setItemSelected : function(vItem, vSelected)
    {
      switch(this.getMultiSelection())
      {
          // Multiple item selection is allowed
        case true:
          if (!this.getItemEnabled(vItem)) {
            return;
          }

          // If selection state is not to be changed => return
          if (this.getItemSelected(vItem) == vSelected) {
            return;
          }

          // Otherwise render new state
          this.renderItemSelectionState(vItem, vSelected);

          // Add item to selection hash / delete it from there
          vSelected ? this._selectedItems.add(vItem) : this._selectedItems.remove(vItem);

          // Dispatch change Event
          this._dispatchChange();

          break;

          // Multiple item selection is NOT allowed

        case false:
          var item0 = this.getSelectedItems()[0];

          if (vSelected)
          {
            // Precheck for any changes
            var old = item0;

            if (this.isEqual(vItem, old)) {
              return;
            }

            // Reset rendering of previous selected item
            if (old != null) {
              this.renderItemSelectionState(old, false);
            }

            // Render new item as selected
            this.renderItemSelectionState(vItem, true);

            // Reset current selection hash
            this._selectedItems.removeAll();

            // Add new one
            this._selectedItems.add(vItem);

            // Dispatch change Event
            this._dispatchChange();
          }
          else
          {
            // Pre-check if item is currently selected
            // Do not allow deselection in single selection mode
            if (!this.isEqual(item0, vItem))
            {
              // Reset rendering as selected item
              this.renderItemSelectionState(vItem, false);

              // Reset current selection hash
              this._selectedItems.removeAll();

              // Dispatch change Event
              this._dispatchChange();
            }
          }

          break;
      }
    },


    /**
     * Get the selected items (objects)
     *
     * @type member
     * @return {var} TODOC
     */
    getSelectedItems : function() {
      return this._selectedItems.toArray();
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getSelectedItem : function() {
      return this._selectedItems.getFirst();
    },


    /**
     * Select given items
     *
     * #param vItems[Array of Widgets]: Items to select
     *
     * @type member
     * @param vItems {var} TODOC
     * @return {void}
     */
    setSelectedItems : function(vItems)
    {
      var oldVal = this._getChangeValue();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Deselect all currently selected items
      this._deselectAll();

      // Apply new selection
      var vItem;
      var vItemLength = vItems.length;

      for (var i=0; i<vItemLength; i++)
      {
        vItem = vItems[i];

        if (!this.getItemEnabled(vItem)) {
          continue;
        }

        // Add item to selection
        this._selectedItems.add(vItem);

        // Render new state for item
        this.renderItemSelectionState(vItem, true);
      }

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {void}
     */
    setSelectedItem : function(vItem)
    {
      if (!vItem) {
        return;
      }

      if (!this.getItemEnabled(vItem)) {
        return;
      }

      var oldVal = this._getChangeValue();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Deselect all currently selected items
      this._deselectAll();

      // Add item to selection
      this._selectedItems.add(vItem);

      // Render new state for item
      this.renderItemSelectionState(vItem, true);

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },


    /**
     * Select all items.
     *
     * @type member
     * @return {void}
     */
    selectAll : function()
    {
      var oldVal = this._getChangeValue();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Call sub method to select all items
      this._selectAll();

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },


    /**
     * Sub method for selectAll. Handles the real work
     *  to select all items.
     *
     * @type member
     * @return {void | Boolean} TODOC
     */
    _selectAll : function()
    {
      if (!this.getMultiSelection()) {
        return;
      }

      var vItem;
      var vItems = this.getItems();
      var vItemsLength = vItems.length;

      // Reset current selection hash
      this._selectedItems.removeAll();

      for (var i=0; i<vItemsLength; i++)
      {
        vItem = vItems[i];

        if (!this.getItemEnabled(vItem)) {
          continue;
        }

        // Add item to selection
        this._selectedItems.add(vItem);

        // Render new state for item
        this.renderItemSelectionState(vItem, true);
      }

      return true;
    },


    /**
     * Deselect all items.
     *
     * @type member
     * @return {void}
     */
    deselectAll : function()
    {
      var oldVal = this._getChangeValue();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Call sub method to deselect all items
      this._deselectAll();

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) this._dispatchChange();
    },


    /**
     * Sub method for deselectAll. Handles the real work
     *  to deselect all items.
     *
     * @type member
     */
    _deselectAll : function()
    {
      // Render new state for items
      var items = this._selectedItems.toArray();

      for (var i=0; i<items.length; i++) {
        this.renderItemSelectionState(items[i], false);
      }

      // Delete all entries in selectedItems hash
      this._selectedItems.removeAll();

      return true;
    },


    /**
     * Select a range of items.
     *
     * #param vItem1[qx.ui.core.Widget]: Start item
     * #param vItem2[qx.ui.core.Widget]: Stop item
     *
     * @type member
     * @param vItem1 {var} TODOC
     * @param vItem2 {var} TODOC
     * @return {void}
     */
    selectItemRange : function(vItem1, vItem2)
    {
      var oldVal = this._getChangeValue();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Call sub method to select the range of items
      this._selectItemRange(vItem1, vItem2, true);

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },


    /**
     * Sub method for selectItemRange. Handles the real work
     * to select a range of items.
     *
     * #param vItem1[qx.ui.core.Widget]: Start item
     * #param vItem2[qx.ui.core.Widget]: Stop item
     * #param vDelect[Boolean]: Deselect currently selected items first?
     *
     * @type member
     * @param vItem1 {var} TODOC
     * @param vItem2 {var} TODOC
     * @param vDeselect {var} TODOC
     * @return {var | Boolean} TODOC
     */
    _selectItemRange : function(vItem1, vItem2, vDeselect)
    {
      // this.debug("SELECT_RANGE: " + vItem1.toText() + "<->" + vItem2.toText());
      // this.debug("SELECT_RANGE: " + vItem1.pos + "<->" + vItem2.pos);
      // Pre-Check a revert call if vItem2 is before vItem1
      if (this.isBefore(vItem2, vItem1)) {
        return this._selectItemRange(vItem2, vItem1, vDeselect);
      }

      // Deselect all
      if (vDeselect) {
        this._deselectAll();
      }

      var vCurrentItem = vItem1;

      while (vCurrentItem != null)
      {
        if (this.getItemEnabled(vCurrentItem))
        {
          // Add item to selection
          this._selectedItems.add(vCurrentItem);

          // Render new state for item
          this.renderItemSelectionState(vCurrentItem, true);
        }

        // Stop here if we reached target item
        if (this.isEqual(vCurrentItem, vItem2)) {
          break;
        }

        // Get next item
        vCurrentItem = this.getNext(vCurrentItem);
      }

      return true;
    },


    /**
     * Internal method for deselection of ranges.
     *
     * #param vItem1[qx.ui.core.Widget]: Start item
     * #param vItem2[qx.ui.core.Widget]: Stop item
     *
     * @type member
     * @param vItem1 {var} TODOC
     * @param vItem2 {var} TODOC
     * @return {var} TODOC
     */
    _deselectItemRange : function(vItem1, vItem2)
    {
      // Pre-Check a revert call if vItem2 is before vItem1
      if (this.isBefore(vItem2, vItem1)) {
        return this._deselectItemRange(vItem2, vItem1);
      }

      var vCurrentItem = vItem1;

      while (vCurrentItem != null)
      {
        // Add item to selection
        this._selectedItems.remove(vCurrentItem);

        // Render new state for item
        this.renderItemSelectionState(vCurrentItem, false);

        // Stop here if we reached target item
        if (this.isEqual(vCurrentItem, vItem2)) {
          break;
        }

        // Get next item
        vCurrentItem = this.getNext(vCurrentItem);
      }
    },




    /*
    ---------------------------------------------------------------------------
      MOUSE EVENT HANDLING
    ---------------------------------------------------------------------------
    */

    _activeDragSession : false,


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param e {Event} TODOC
     * @return {void}
     */
    handleMouseDown : function(vItem, e)
    {
      // Only allow left and right button
      if (!e.isLeftPressed() && !e.isRightPressed()) {
        return;
      }

      // Keep selection on right click on already selected item
      if (e.isRightPressed() && this.getItemSelected(vItem)) {
        return;
      }

      // Shift Key
      //   or
      // Click on an unseleted item (without Ctrl)
      if (
        e.isShiftPressed() ||
        this.getDragSelection() ||
        (!this.getItemSelected(vItem) && !e.isCtrlPressed())
      )
      {
        // Handle event
        this._onmouseevent(vItem, e);
      }
      else
      {
        // Update lead item
        this.setLeadItem(vItem);
      }

      // Handle dragging
      this._activeDragSession = this.getDragSelection();

      if (this._activeDragSession)
      {
        // Add mouseup listener and register as capture widget
        this.getBoundedWidget().addListener("mouseup", this._ondragup, this);
        this.getBoundedWidget().capture();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param e {Event} TODOC
     * @return {void}
     */
    _ondragup : function(e)
    {
      this.getBoundedWidget().removeListener("mouseup", this._ondragup, this);
      this.getBoundedWidget().releaseCapture();
      this._activeDragSession = false;
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @param e {Event} TODOC
     * @return {void}
     */
    handleMouseUp : function(vItem, e)
    {
      if (!e.isLeftPressed()) {
        return;
      }

      if (e.isCtrlPressed() || this.getItemSelected(vItem) && !this._activeDragSession) {
        this._onmouseevent(vItem, e);
      }

      if (this._activeDragSession)
      {
        this._activeDragSession = false;
        this.getBoundedWidget().releaseCapture();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param oItem {Object} TODOC
     * @param e {Event} TODOC
     * @return {void}
     */
    handleMouseOver : function(oItem, e)
    {
      if (!this.getDragSelection() || !this._activeDragSession) {
        return;
      }

      this._onmouseevent(oItem, e, true);
    },


    /**
     * Internal handler for all mouse events bound to this manager.
     *
     * @type member
     * @param oItem {Object} TODOC
     * @param e {Event} TODOC
     * @param bOver {Boolean} TODOC
     * @return {void}
     */
    _onmouseevent : function(oItem, e, bOver)
    {
      if (!this.getItemEnabled(oItem)) {
        return;
      }

      // ********************************************************************
      //   Init
      // ********************************************************************
      // Cache current (old) values
      var oldVal = this._getChangeValue();
      var oldLead = this.getLeadItem();

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Cache selection and count
      var selectedItems = this.getSelectedItems();
      var selectedCount = selectedItems.length;

      // Update lead item
      this.setLeadItem(oItem);

      // Cache current anchor item
      var currentAnchorItem = this.getAnchorItem();

      // Cache keys pressed
      var vCtrlKey = e.isCtrlPressed();
      var vShiftKey = e.isShiftPressed();

      // ********************************************************************
      //   Do we need to update the anchor?
      // ********************************************************************
      if (
        !currentAnchorItem ||
        selectedCount == 0 ||
        (vCtrlKey && !vShiftKey && this.getMultiSelection() && !this.getDragSelection()))
      {
        this.setAnchorItem(oItem);
        currentAnchorItem = oItem;
      }

      // ********************************************************************
      //   Mode #1: Replace current selection with new one
      // ********************************************************************
      if ((!vCtrlKey && !vShiftKey && !this._activeDragSession || !this.getMultiSelection()))
      {
        if (!this.getItemEnabled(oItem)) {
          return;
        }

        // Remove current selection
        this._deselectAll();

        // Update anchor item
        this.setAnchorItem(oItem);

        if (this._activeDragSession)
        {
          // a little bit hacky, but seems to be a fast way to detect if we slide to top or to bottom
          this.scrollItemIntoView((this.getBoundedWidget().getScrollTop() > (this.getItemOffset(oItem) - 1) ? this.getPrevious(oItem) : this.getNext(oItem)) || oItem);
        }

        if (!this.getItemSelected(oItem)) {
          this.renderItemSelectionState(oItem, true);
        }

        // Clear up and add new one
        // this._selectedItems.removeAll();
        this._selectedItems.add(oItem);

        this._addToCurrentSelection = true;
      }

      // ********************************************************************
      //   Mode #2: (De-)Select item range in mouse drag session
      // ********************************************************************
      else if (this._activeDragSession && bOver)
      {
        if (oldLead) {
          this._deselectItemRange(currentAnchorItem, oldLead);
        }

        // Drag down
        if (this.isBefore(currentAnchorItem, oItem))
        {
          if (this._addToCurrentSelection) {
            this._selectItemRange(currentAnchorItem, oItem, false);
          } else {
            this._deselectItemRange(currentAnchorItem, oItem);
          }
        }

        // Drag up
        else
        {
          if (this._addToCurrentSelection) {
            this._selectItemRange(oItem, currentAnchorItem, false);
          } else {
            this._deselectItemRange(oItem, currentAnchorItem);
          }
        }

        // a little bit hacky, but seems to be a fast way to detect if we slide to top or to bottom
        this.scrollItemIntoView((this.getBoundedWidget().getScrollTop() > (this.getItemOffset(oItem) - 1) ? this.getPrevious(oItem) : this.getNext(oItem)) || oItem);
      }

      // ********************************************************************
      //   Mode #3: Add new item to current selection (ctrl pressed)
      // ********************************************************************
      else if (this.getMultiSelection() && vCtrlKey && !vShiftKey)
      {
        if (!this._activeDragSession) {
          this._addToCurrentSelection = !(this.getCanDeselect() && this.getItemSelected(oItem));
        }

        this.setItemSelected(oItem, this._addToCurrentSelection);
        this.setAnchorItem(oItem);
      }

      // ********************************************************************
      //   Mode #4: Add new (or continued) range to selection
      // ********************************************************************
      else if (this.getMultiSelection() && vCtrlKey && vShiftKey)
      {
        if (!this._activeDragSession) {
          this._addToCurrentSelection = !(this.getCanDeselect() && this.getItemSelected(oItem));
        }

        if (this._addToCurrentSelection) {
          this._selectItemRange(currentAnchorItem, oItem, false);
        } else {
          this._deselectItemRange(currentAnchorItem, oItem);
        }
      }

      // ********************************************************************
      //   Mode #5: Replace selection with new range selection
      // ********************************************************************
      else if (this.getMultiSelection() && !vCtrlKey && vShiftKey)
      {
        if (this.getCanDeselect()) {
          this._selectItemRange(currentAnchorItem, oItem, true);
        }
        else
        {
          if (oldLead) {
            this._deselectItemRange(currentAnchorItem, oldLead);
          }

          this._selectItemRange(currentAnchorItem, oItem, false);
        }
      }

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },




    /*
    ---------------------------------------------------------------------------
      KEY EVENT HANDLER
    ---------------------------------------------------------------------------
    */


    /**
     * Handles key event to perform selection and navigation
     *
     * @type member
     * @param ev {qx.event.type.KeyEvent} event object
     * @return {void}
     */
    handleKeyPress : function(ev)
    {
      var oldVal = this._getChangeValue();

      // this.debug("KeyPress: " + ev.getKeyIdentifier());

      // Temporary disabling of event fire
      var oldFireChange = this.getFireChange();
      this.setFireChange(false);

      // Ctrl+A: Select all
      if (ev.getKeyIdentifier() == "A" && ev.isCtrlPressed())
      {
        if (this.getMultiSelection())
        {
          this._selectAll();

          // Update lead item to this new last
          // (or better here: first) selected item
          this.setLeadItem(this.getFirst());
        }
      }

      // Default operation
      else
      {
        var aIndex = this.getAnchorItem();
        var itemToSelect = this.getItemToSelect(ev);

        // this.debug("Anchor: " + (aIndex ? aIndex.getLabel() : "null"));
        // this.debug("ToSelect: " + (itemToSelect ? itemToSelect.getLabel() : "null"));
        if (itemToSelect && this.getItemEnabled(itemToSelect))
        {
          // Update lead item to this new last selected item
          this.setLeadItem(itemToSelect);

          // Scroll new item into view
          this.scrollItemIntoView(itemToSelect);

          // Select a range
          if (ev.isShiftPressed() && this.getMultiSelection())
          {
            // Make it a little bit more failsafe:
            // Set anchor if not given already. Allows us to select
            // a range without any previous selection.
            if (aIndex == null) {
              this.setAnchorItem(itemToSelect);
            }

            // Select new range (and clear up current selection first)
            this._selectItemRange(this.getAnchorItem(), itemToSelect, true);
          }
          else if (!ev.isCtrlPressed())
          {
            // Clear current selection
            this._deselectAll();

            // Update new item to be selected
            this.renderItemSelectionState(itemToSelect, true);

            // Add item to new selection
            this._selectedItems.add(itemToSelect);

            // Update anchor to this new item
            // (allows following shift range selection)
            this.setAnchorItem(itemToSelect);
          }
          else if (ev.getKeyIdentifier() == "Space")
          {
            if (this._selectedItems.contains(itemToSelect))
            {
              // Update new item to be selected
              this.renderItemSelectionState(itemToSelect, false);

              // Add item to new selection
              this._selectedItems.remove(itemToSelect);

              // Fix anchor item
              this.setAnchorItem(this._selectedItems.getFirst());
            }
            else
            {
              // Clear current selection
              if (!ev.isCtrlPressed() || !this.getMultiSelection()) {
                this._deselectAll();
              }

              // Update new item to be selected
              this.renderItemSelectionState(itemToSelect, true);

              // Add item to new selection
              this._selectedItems.add(itemToSelect);

              // Update anchor to this new item
              // (allows following shift range selection)
              this.setAnchorItem(itemToSelect);
            }
          }
        }
      }

      // Recover change event status
      this.setFireChange(oldFireChange);

      // Dispatch change Event
      if (oldFireChange && this._hasChanged(oldVal)) {
        this._dispatchChange();
      }
    },


    /**
     * TODOC
     *
     * @type member
     * @param vKeyboardEvent {var} TODOC
     * @return {null | var} TODOC
     */
    getItemToSelect : function(vKeyboardEvent)
    {
      // Don't handle ALT here
      if (vKeyboardEvent.isAltPressed()) {
        return null;
      }

      // Handle event by key identifier
      switch(vKeyboardEvent.getKeyIdentifier())
      {
        case "Home":
          return this.getHome(this.getLeadItem());

        case "End":
          return this.getEnd(this.getLeadItem());

        case "Down":
          return this.getDown(this.getLeadItem());

        case "Up":
          return this.getUp(this.getLeadItem());

        case "Left":
          return this.getLeft(this.getLeadItem());

        case "Right":
          return this.getRight(this.getLeadItem());

        case "PageUp":
          return this.getPageUp(this.getLeadItem()) || this.getHome(this.getLeadItem());

        case "PageDown":
          return this.getPageDown(this.getLeadItem()) || this.getEnd(this.getLeadItem());

        case "Space":
          if (vKeyboardEvent.isCtrlPressed()) {
            return this.getLeadItem();
          }
      }

      return null;
    },




    /*
    ---------------------------------------------------------------------------
      CHANGE HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {void}
     */
    _dispatchChange : function()
    {
      if (!this.getFireChange()) {
        return;
      }

      this.fireDataEvent("changeSelection", this.getSelectedItems(), true);
    },


    /**
     * TODOC
     *
     * @type member
     * @param sOldValue {String} TODOC
     * @return {var} TODOC
     */
    _hasChanged : function(sOldValue) {
      return sOldValue != this._getChangeValue();
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    _getChangeValue : function() {
      return this._selectedItems.getChangeValue();
    },




    /*
    ---------------------------------------------------------------------------
      POSITION HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getHome : function() {
      return this.getFirst();
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getEnd : function() {
      return this.getLast();
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getDown : function(vItem)
    {
      if (!vItem) {
        return this.getFirst();
      }

      return this.getMultiColumnSupport() ? (this.getUnder(vItem) || this.getLast()) : this.getNext(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getUp : function(vItem)
    {
      if (!vItem) {
        return this.getLast();
      }

      return this.getMultiColumnSupport() ? (this.getAbove(vItem) || this.getFirst()) : this.getPrevious(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {null | var} TODOC
     */
    getLeft : function(vItem)
    {
      if (!this.getMultiColumnSupport()) {
        return null;
      }

      return !vItem ? this.getLast() : this.getPrevious(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {null | var} TODOC
     */
    getRight : function(vItem)
    {
      if (!this.getMultiColumnSupport()) {
        return null;
      }

      return !vItem ? this.getFirst() : this.getNext(vItem);
    },


    /**
     * TODOC
     *
     * @type member
     * @abstract
     * @param vItem {var} TODOC
     * @return {var}
     * @throws the abstract function warning.
     */
    getAbove : function(vItem) {
      throw new Error("getAbove(): Not implemented yet");
    },


    /**
     * TODOC
     *
     * @type member
     * @abstract
     * @param vItem {var} TODOC
     * @return {var}
     * @throws the abstract function warning.
     */
    getUnder : function(vItem) {
      throw new Error("getUnder(): Not implemented yet");
    },




    /*
    ---------------------------------------------------------------------------
      PAGE HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Jump a "page" up.
     *
     * #param vItem[qx.ui.core.Widget]: Relative to this widget
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getPageUp : function(vItem)
    {
      var vBoundedWidget = this.getBoundedWidget();
      var vParentScrollTop = vBoundedWidget.getScrollTop();
      var vParentClientHeight = vBoundedWidget.getInnerHeight();

      // Find next item
      var nextItem = this.getLeadItem();

      if (!nextItem) {
        nextItem = this.getFirst();
      }

      // Normally we should reach the status "lead" for the
      // nextItem after two iterations.
      var tryLoops = 0;

      while (tryLoops < 2)
      {
        while (nextItem && (this.getItemOffset(nextItem) - this.getItemSize(nextItem) >= vParentScrollTop)) {
          nextItem = this.getUp(nextItem);
        }

        // This should never occour after the fix above
        if (nextItem == null) {
          break;
        }

        // If the nextItem is not anymore the leadItem
        // Means: There has occured a change.
        // We break here. This is normally the second step.
        if (nextItem != this.getLeadItem())
        {
          // be sure that the top is reached
          this.scrollItemIntoView(nextItem, true);
          break;
        }

        // Update scrolling (this is normally the first step)
        // this.debug("Scroll-Up: " + (vParentScrollTop + vParentClientHeight - 2 * this.getItemSize(nextItem)));
        vBoundedWidget.setScrollTop(vParentScrollTop - vParentClientHeight - this.getItemSize(nextItem));

        // Use the real applied value instead of the calulated above
        vParentScrollTop = vBoundedWidget.getScrollTop();

        // Increment counter
        tryLoops++;
      }

      return nextItem;
    },


    /**
     * Jump a "page" down.
     *
     * #param vItem[qx.ui.core.Widget]: Relative to this widget
     *
     * @type member
     * @param vItem {var} TODOC
     * @return {var} TODOC
     */
    getPageDown : function(vItem)
    {
      var vBoundedWidget = this.getBoundedWidget();
      var vParentScrollTop = vBoundedWidget.getScrollTop();
      var vParentClientHeight = vBoundedWidget.getInnerHeight();

      // this.debug("Bound: " + (vBoundedWidget._getTargetNode() != vBoundedWidget.getElement()));
      // this.debug("ClientHeight-1: " + vBoundedWidget._getTargetNode().clientHeight);
      // this.debug("ClientHeight-2: " + vBoundedWidget.getElement().clientHeight);
      // Find next item
      var nextItem = this.getLeadItem();

      if (!nextItem) {
        nextItem = this.getFirst();
      }

      // Normally we should reach the status "lead" for the
      // nextItem after two iterations.
      var tryLoops = 0;

      while (tryLoops < 2)
      {
        // this.debug("Loop: " + tryLoops);
        // this.debug("Info: " + nextItem + " :: " + (this.getItemOffset(nextItem) + (2 * this.getItemSize(nextItem))) + " <> " + (vParentScrollTop + vParentClientHeight));
        // this.debug("Detail: " + vParentScrollTop + ", " + vParentClientHeight);
        // Find next
        while (nextItem && ((this.getItemOffset(nextItem) + (2 * this.getItemSize(nextItem))) <= (vParentScrollTop + vParentClientHeight))) {
          nextItem = this.getDown(nextItem);
        }

        // This should never occour after the fix above
        if (nextItem == null) {
          break;
        }

        // If the nextItem is not anymore the leadItem
        // Means: There has occured a change.
        // We break here. This is normally the second step.
        if (nextItem != this.getLeadItem()) {
          break;
        }

        // Update scrolling (this is normally the first step)
        // this.debug("Scroll-Down: " + (vParentScrollTop + vParentClientHeight - 2 * this.getItemSize(nextItem)));
        vBoundedWidget.setScrollTop(vParentScrollTop + vParentClientHeight - 2 * this.getItemSize(nextItem));

        // Use the real applied value instead of the calulated above
        vParentScrollTop = vBoundedWidget.getScrollTop();

        // Increment counter
        tryLoops++;
      }

      // this.debug("Select: " + nextItem._labelObject.getText());
      return nextItem;
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this._disposeObjects("_selectedItems");
  }
});
