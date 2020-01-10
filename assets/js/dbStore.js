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
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                'name': 'project',
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
                // 创建一个数据库存储对象
                var objectStore = db.createObjectStore(dbName, {
                    keyPath: 'id',
                    autoIncrement: false,
                });
                // 定义存储对象的数据项
                objectStore.createIndex('id', 'id', {
                    unique: true
                });
                objectStore.createIndex('name', 'name', { unique: false, });
                objectStore.createIndex('begin', 'begin');
                objectStore.createIndex('end', 'end');
                objectStore.createIndex('person', 'person');
                objectStore.createIndex('remark', 'remark');
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
