/* Web Request */
(function() {
    var WebRequest = function(argumentConfig) {
        this.config = this.__DefaultConfig__(argumentConfig);
        this.__init__();
    }
    WebRequest.prototype = {
        __DefaultConfig__: function(argumentConfig) {
            var config = {};
            return $.extend(config, argumentConfig);
        },
        __AJAXConfig__: function(argumentConfig) {
            var self = this;
            var config = {
                url: "",
                type: "",
                data: "",
                dataType: "json",
                async: true,
                defaultResponse: {},
                success: function(json) {},
                error: function(XMLHttpRequest, textStatus, errorThrown) {},
                complete: function(XMLHttpRequest, TypeStatus) {
                    config.EventComplete(XMLHttpRequest, TypeStatus, this);
                    if (this.async) {
                        self.QueueNext();
                    }
                },
            };
            var source = $.extend(config, argumentConfig)
            var target = $.extend(source, {
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    self.ErrorResponseProcessing(XMLHttpRequest, textStatus, errorThrown, source);
                },
            });
            return target;
        },
        __init__: function() {
            var self = this;
        },
        Send: function(argumentConfig) {
            var self = this;
            var config = self.__AJAXConfig__(argumentConfig);
            $.ajax(config);
        },
        ErrorResponseProcessing: function(XMLHttpRequest, textStatus, errorThrown, config) {
            var self = this;
            if (!config) {
                console.log('ErrorResponseProcessing.config is null!');
                self.PrintErrorInfoObject(XMLHttpRequest, textStatus. errorThrown);
                return;
            }
            if (!self.IsSuccessRequest(XMLHttpRequest)) {
                self.PrintErrorInfoObject(XMLHttpRequest, textStatus, errorThrown);
                return;
            }
            var sjson = XMLHttpRequest.responseText;
            if (!sjson || sjson == "") {
                self.PrintErrorInfoObject(XMLHttpRequest, textStatus, errorThrown);
                return;
            }
            self.ParseSJSONExeSuccessMethod(sjson, config);
        },
        IsSuccessRequest: function(XMLHttpRequest) {
            var xhp = XMLHttpRequest;
            /* XMLHttpRequest 对象属性值参照地址: http://www.w3school.com.cn/xmldom/dom_http.asp */
            return xhp.status == 200 || xhp.readyState == 4;
        },
        PrintErrorInfoObject: function(XMLHttpRequest, textStatus, errorThrown) {
            var self = this;
            console.log("XMLHttpRequest:", XMLHttpRequest);
            console.log("textStatus:", textStatus);
            console.log("errorThrown:", errorThrown);
        },
        ParseSJSONExeSuccessMethod: function(sjson, config) {
            var self = this;
            var json = {};
            try {
                json = JSON.parse(sjson);
            } catch(ex) {
                console.log('parse json Error:', json, '\tex:', ex);
                json = Object.get(config, "defaultResponse", self.ConfigDefaultResponse());
            }
            config.success(json);
        },
        ConfigDefaultResponse: function(config) {
            var self = this;
            var dataType = Object.get(config, "dataType", "json");
            var type = dataType.toString();
            type = type.toLowerCase();
            switch(type) {
                case "json": return {};
                case "xml": return "";
                default: return {};
            }
        },
    };
    WebRequest.prototype.constructor = WebRequest;
    this.WebRequest = WebRequest;
})();
