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
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/* ************************************************************************

#module(bom)

#require(qx.event.handler.Input)

************************************************************************ */

/**
 * Cross browser abstractions to work with input elements.
 */
qx.Class.define("qx.bom.Input",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Creates an DOM input/textarea/select element.
     *
     * Attributes may be given directly with this call. This is critical
     * for some attributes e.g. name, type, ... in many clients.
     *
     * Note: <code>select</code> and <code>textarea</code> elements are created 
     * using the identically named <code>type</code>.
     *
     * @type static
     * @param type {String} Any valid type for HTML, <code>select</code> 
     *   and <code>textarea</code>
     * @param attributes {Map} Map of attributes to apply
     * @param win {Window} Window to create the element for
     * @return {Element} The created iframe node
     */
    create : function(type, attributes, win)
    {
      // Work on a copy to not modify given attributes map
      var attributes = attributes ? qx.lang.Object.copy(attributes) : {};      

      var elem;
      var tag;
      
      if (type === "textarea" || type === "select") 
      {
        tag = type; 
      }
      else 
      {
        tag = "input"; 
        attributes.type = type;
      }
      
      if (qx.core.Variant.isSet("qx.client", "mshtml")) 
      {
        attributes.onpropertychange = "qx.event.handler.Input.onpropertyevent(this)";  
        
        if (type === "textarea" || type === "text" || type === "file") {
          attributes.onchange = "qx.event.handler.Input.onchangevalueevent(this)"; 
        }
      }
      else
      {
        if (type === "radio" || type === "checkbox") {
          attributes.onchange = "qx.event.handler.Input.onchangecheckedevent(this)";
        } else {
          attributes.onchange = "qx.event.handler.Input.onchangevalueevent(this)";
        }
        
        if (type === "textarea" || type === "text") {
          attributes.oninput = "qx.event.handler.Input.oninputevent(this)"; 
        }
      }

      return qx.bom.Element.create(tag, attributes, win);
    },
    
    
    /**
     * Sets the value of the given element.
     *
     * @type static
     * @param element {Element} DOM element to modify
     * @param value {
     */
    setValue : qx.core.Variant.select("qx.client",
    {
      "mshtml" : function(element, value)
      {
        element.__inValueSet = true;
        element.value = value;
        delete element.__inValueSet;
      },
      
      "default" : function(element, value) {
        element.value = value;   
      }
    })
  }
});
