(function() {
    var gwin = this;
    this.UrlParameter = function() {
        this.get = function(name, location_search_string) {
            location_search_string = location_search_string || gwin.location.search;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = location_search_string.substr(1).match(reg);
            return r != null ? decodeURIComponent(r[2]) : null;
        };

        this.serialize = function(object, traditional) {
            return $.param(object, traditional);
        }
    };
})();
