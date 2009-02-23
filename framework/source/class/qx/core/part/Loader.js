/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * The part loader knows about all generated packages and parts.
 * 
 * It contains functionality to load parts and to retrieve part instances.
 */
qx.Class.define("qx.core.part.Loader",
{
  type : "singleton",
  extend : qx.core.Object,
  
  construct : function()
  {    
    this.base(arguments);

    this.__packages = [];
    var uris = qx.$$loader.uris;
    for (var i=0; i<uris.length; i++) {
      this.__packages.push(new qx.core.part.Package(uris[i], i==0));
    };

    this.__parts = {};
    var parts = qx.$$loader.parts;
    
    for (var name in parts)
    {
      var pkgIndexes = parts[name];
      var packages = []; 
      for (var i=0; i<pkgIndexes.length; i++) {
        packages.push(this.__packages[pkgIndexes[i]]);
      }
      this.__parts[name] = new qx.core.part.Part(name, packages);
    }
  },
  
  
  members :
  {
  
    /**
     * Loads a part asynchronously. The callback is called after the part and
     * its dependencies are fully loaded. If the part is already loaded the
     * callback is called immediately.
     *
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @param callback {Function} Function to execute on completion
     * @param self {Object?window} Context to execute the given function in
     */
    loadPart : function(name, callback, self)
    {
      var callback = callback || function() {};
      var self = self || window;
      
      this.getPart(name).load(callback, self);
    },
    
    
    /**
     * Get the part instance of the part with the given name.
     * 
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @return {Part} The corresponding part instance
     */
    getPart : function(name)
    {
      var part = this.__parts[name];
      
      // unknown part
      if (!part) {
        throw new Error("No such part: " + name)
      }

      return part;
    }
  }
});
