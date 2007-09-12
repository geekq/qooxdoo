/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#module(event)

************************************************************************ */

/**
 * This class supports typical DOM element inline events like scroll,
 * change, select, ... 
 */
qx.Class.define("qx.event.handler.Element",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @type constructor
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    this._manager = manager;
    this._registeredEvents = {};
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */
  
  statics : 
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Manager.PRIORITY_NORMAL
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
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type)
    {
      return (
        (this._eventTypes[type]) &&
        (
          typeof(target.nodeType) === "number" ||
          typeof(target.document) === "object"
        )
      );
    },


    // interface implementation
    registerEvent : function(target, type)
    {
      var elementId = qx.core.Object.toHashCode(target);
      var listener = qx.lang.Function.bind(this._onNative, this, false, [elementId]);

      qx.event.Manager.addNativeListener(target, type, listener);

      var id = elementId + type;

      this._registeredEvents[id] =
      {
        element : target,
        type : type,
        listener : listener
      };
    },


    // interface implementation
    unregisterEvent : function(target, type)
    {
      var id = qx.core.Object.toHashCode(target) + type;

      var eventData = this._registeredEvents[id];
      qx.event.Manager.removeNativeListener(target, type, eventData.listener);

      delete this._registeredEvents[id];
    },







    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    /** {Map} Internal data structure with all supported BOM element events */
    _eventTypes :
    {
      abort : true,    // Image elements
      scroll : true,
      change : true,
      select : true,
      reset : true,    // Form Elements
      submit : true   // Form Elements
    },






    /*
    ---------------------------------------------------------------------------
      EVENT-HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Default event handler.
     *
     * @type member
     * @param elementId {Integer} element id of the current target
     * @param domEvent {Event} DOM event
     * @return {void}
     */
    _onNative : function(elementId, domEvent)
    {
      var event = qx.event.Manager.createEvent(qx.event.type.Dom, [domEvent]);
      event.setBubbles(false);

      var eventData = this._registeredEvents[elementId + event.getType()];
      var element = eventData ? eventData.element : event.getTarget();

      event.setCurrentTarget(element);

      this._manager.dispatchEvent(domEvent.target || domEvent.srcElement, event);
    }
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    for (var id in this._registeredEvents)
    {
      var eventData = this._registeredEvents[id];

      qx.event.Manager.removeNativeListener(
        eventData.element,
        eventData.type,
        eventData.listener
      );
    }

    this._disposeFields("_manager", "_registeredEvents");
  },






  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Manager.registerHandler(statics);
  }
});
