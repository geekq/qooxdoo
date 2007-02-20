
qx.Clazz.define("qxunit.test.Xml", { 
	extend: qxunit.TestCase,

	members : {

	    serializeArray: function(arr) {
	        var ser = [];
	        for (var i=0; i<arr.length; i++) {
	            ser[i] = qx.xml.Element.serialize(arr[i]);
	        }
	        return ser.join(", ");
	    },

	    testParseSerializeXml: function() {
	        var doc = qx.xml.Document.create();
	        this.assertTrue(qx.xml.Document.isDocument(doc));

	        var div = doc.createElement("div");
	        this.assertEquals("div", div.tagName);

	        var xmlStr =
	            '<html>' +
	            '<body>Juhu <em id="toll">Kinners</em>. Wie geht es <em>Euch</em>?</body>'+
	            '</html>';

	        var doc2 = qx.xml.Document.fromString(xmlStr);
	        this.assertTrue(qx.xml.Document.isDocument(doc2));

	        this.assertEquals(xmlStr, qx.xml.Element.serialize(doc2));
	    },

	    testCreateDocument: function() {
	        var doc = qx.xml.Document.create("", "rss");
	        this.assertEquals(
	            'rss',
	            doc.documentElement.tagName
	        );
	        this.assertEquals(
	            0,
	            doc.documentElement.childNodes.length
	        );

	        var doc = qx.xml.Document.create("http://www.w3.org/1999/xhtml", "html");
	        this.assertEquals(
	            'http://www.w3.org/1999/xhtml',
	            doc.documentElement.namespaceURI
	        );
	        this.assertEquals(
	            'html',
	            doc.documentElement.tagName
	        );
	        this.assertEquals(
	            0,
	            doc.documentElement.childNodes.length
	        );
	    },

	    testXPath: function() {
	        var xmlStr = '<html><body>Juhu <em id="toll">Kinners</em>. Wie geht es <em>Euch</em>?</body></html>';
	        var doc2 = qx.xml.Document.fromString(xmlStr);

	        var em = doc2.getElementsByTagName("em")[0];
	        this.assertEquals('<em id="toll">Kinners</em>', qx.xml.Element.serialize(em));

	        this.assertEquals(
	            qx.xml.Element.serialize(em),
	            qx.xml.Element.serialize(qx.xml.Element.selectSingleNode(doc2, '//*[@id="toll"]'))
	        );

	        this.assertEquals(
	            qx.xml.Element.serialize(doc2.getElementsByTagName("body")[0]),
	            qx.xml.Element.serialize(qx.xml.Element.selectSingleNode(doc2, '//body'))
	        );

	        this.assertEquals(
	            this.serializeArray(doc2.getElementsByTagName("em")),
	            this.serializeArray(qx.xml.Element.selectNodes(doc2, '//em'))
	        );

	        this.assertEquals(
	            this.serializeArray(doc2.getElementsByTagName("em")),
	            this.serializeArray(qx.xml.Element.selectNodes(doc2.documentElement, '//em'))
	        );
	    },

	    testXHR: function() {

	        function error(msg) {
	            return function() {
	                failed = msg;
	            }
	        }

	        var req = new qx.io.remote.Request(
	            "../source/html/qooxdoo-blog.xml",
	            qx.net.Http.METHOD_GET, qx.util.Mime.XML
	        );
	        req.setAsynchronous(false);
	        var failed = "";
	        var xmlDocument;
	        req.addEventListener("aborted", error("aborted"));
	        req.addEventListener("failed", error("failed"));
	        req.addEventListener("timeout", error("timeout"));
	        req.addEventListener("completed", function(e) {
	            xmlDocument = e.getData().getContent();
	        });
	        req.send();

	        this.assertEquals("", failed);
	        this.assertTrue(qx.xml.Document.isDocument(xmlDocument));
	        this.assertEquals("rss", xmlDocument.documentElement.tagName);
	    },

	    testGetElementsByTagNameNS: function() {
	        var xmlStr = "<?xml version='1.0' encoding='UTF-8'?>"+
	            "<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'>"+
	            "<xsl:output method='xml' version='1.0' encoding='UTF-8' indent='yes'/>"+
	            "<xsl:template match='*'></xsl:template><xsl:template match='@*'>"+
	            "</xsl:template></xsl:stylesheet>";

	        var nsDoc = qx.xml.Document.fromString(xmlStr);

	        var templates = qx.xml.Element.getElementsByTagNameNS(
	            nsDoc,
	            "http://www.w3.org/1999/XSL/Transform",
	            "template"
	        );

	        this.debug(qx.xml.String.escape(this.serializeArray(templates)));
	        this.assertEquals(
	            2,
	            templates.length,
	            "getElementsByTagNameNS for XML documents failed!"
	        );

	        this.assertEquals(
	            "xsl:template",
	            templates[0].tagName,
	            "getElementsByTagNameNS for XML documents failed!"
	        );

	        var templates = qx.xml.Element.getElementsByTagNameNS(
	            nsDoc.documentElement,
	            "http://www.w3.org/1999/XSL/Transform",
	            "template"
	        );

	        this.assertEquals(
	            2,
	            templates.length,
	            "getElementsByTagNameNS for element nodes failed!"
	        );

	        this.assertEquals(
	            "xsl:template",
	            templates[0].tagName,
	            "getElementsByTagNameNS for element nodes failed!"
	        );
	   }
	}
});