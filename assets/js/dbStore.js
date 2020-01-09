(function() {
    var ObjectIndexedDB = this.indexedDB ||
        this.webkitIndexedDB ||
        this.mozIndexedDB ||
        this.msIndexedDB;

    var dbStore = function(argumentConfig) {
        this.config = this.__DefaultConfig__(argumentConfig);
        this.__init__();
    }
    dbStore.prototype = {
        __init__: function() {
        },
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                'name': 'project',
            };
            return $.extend(config, argumentConfig);
        },
        Insert: function(model) {
            var self = this;
            return true;
        },
        Edit: function(model) {
            var self = this;
            return true;
        },
        Delete: function(selectMethod) {
            var self = this;
            return true;
        },
        Query: function(selectMethod) {
            var self = this;
            return [];
        },
    };
    dbStore.prototype.constructor = dbStore;
    dbStore.IsSupportIndexedDB = function() {
        if (ObjectIndexedDB) {
            return true;
        }
        return false;
    }
    this.dbStore = dbStore;
})();
