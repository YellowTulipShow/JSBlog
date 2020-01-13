(function() {
    // 在下面的行中，应包括要测试的实现的前缀。
    this.indexedDB = this.indexedDB || this.mozIndexedDB || this.webkitIndexedDB || this.msIndexedDB;
    // 如果您不在函数中，请不要使用“ var indexedDB = ...”。
    // 此外，您可能需要引用一些window.IDB *对象：
    this.IDBTransaction = this.IDBTransaction || this.webkitIDBTransaction || this.msIDBTransaction;
    this.IDBKeyRange = this.IDBKeyRange || this.webkitIDBKeyRange || this.msIDBKeyRange;
    //（Mozilla从未为这些对象添加前缀，因此我们不需要window.mozIDB *）
    var ObjectIndexedDB = this.indexedDB;

    var dbStore = function(argumentConfig) {
        this.config = this.__DefaultConfig__(argumentConfig);
        this.db = {};
        this.__init__();
    }
    dbStore.prototype = {
        _fieldTempate_: function() {
            return {
                name: "",
                isSign: false,
                isUnique: false,
            };
        },
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                'name': 'project',
                "fields": [],
                dbOpenError: function() {},
                dbOpenSuccess: function() {},
            };
            return $.extend(config, argumentConfig);
        },
        __init__: function() {
            var self = this;
            var dbName = self.config.name;
            var version = 1;

            // 打开数据库
            var DBOpenRequest = ObjectIndexedDB.open(dbName, version);

            // 如果数据库打开失败
            DBOpenRequest.onerror = function(event) {
                self.config.dbOpenError();
            };

            DBOpenRequest.onsuccess = function(event) {
                // 存储数据结果
                self.db = DBOpenRequest.result;
                self.config.dbOpenSuccess();
            };

            // 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
            DBOpenRequest.onupgradeneeded = function(event) {
                var db = event.target.result;
                db.onerror = function(event) {
                    self.config.dbOpenError();
                };

                var fields = self.config.fields;

                var keyName = null;
                for (var i = 0; i < fields.length; i++) {
                    var item = fields[i];
                    if (!keyName) {
                        if (Object.get(item, "isSign", false) === true) {
                            keyName = Object.get(item, "name", "");
                        }
                    }
                }

                var dIDKey = "id";
                // 创建一个数据库存储对象
                var objectStore = db.createObjectStore(dbName, {
                    keyPath: keyName || dIDKey,
                    autoIncrement: (keyName || dIDKey) == dIDKey,
                });

                // 定义存储对象的数据项
                if (!keyName) {
                    objectStore.createIndex(dIDKey, dIDKey, { unique: true });
                }
                for (var i = 0; i < fields.length; i++) {
                    var item = fields[i];
                    var name = Object.get(item, "name", "");
                    if (keyName == name) {
                        continue;
                    }
                    var unique = Object.get(item, "isUnique", false);
                    objectStore.createIndex(name, name, { unique: unique, });
                }
            };
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
