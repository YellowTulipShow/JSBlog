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
                "name": "project",
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
                self.db = db;

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
        Insert: function(model, callback) {
            callback = callback || function(model) {};
            var self = this;
            var db = self.db;
            var dbName = self.config.name;

            var transaction = db.transaction([dbName], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbName);
            // 添加到数据对象中
            var objectStoreRequest = objectStore.add(model);
            objectStoreRequest.onsuccess = function(event) {
                callback(model);
            };
        },
        Edit: function(keySign, model) {
            var self = this;
            var db = self.db;
            var dbName = self.config.name;

            // 编辑数据
            var transaction = db.transaction([dbName], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbName);
            // 获取存储的对应键的存储对象
            var objectStoreRequest = objectStore.getValue(keySign);
            // 获取成功后替换当前数据
            objectStoreRequest.onsuccess = function(event) {
                // 当前数据
                var myRecord = objectStoreRequest.result;
                // 遍历替换
                for (var key in model) {
                    if (typeof myRecord[key] != 'undefined') {
                        myRecord[key] = model[key];
                    }
                }
                // 更新数据库存储数据
                objectStore.put(myRecord);
            };
        },
        Delete: function(keySign, callback) {
            callback = callback || function(keySign) {};
            var self = this;
            var db = self.db;
            var dbName = self.config.name;

            // 打开已经存储的数据对象
            var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);
            // 直接删除
            var objectStoreRequest = objectStore.delete(keySign);
            // 删除成功后
            objectStoreRequest.onsuccess = function() {
                callback(keySign);
            };
        },
        Query: function(selectMethod, callback) {
            selectMethod = selectMethod || function(value) {
                return true;
            };
            callback = callback || function(result_list) {};
            var self = this;
            var db = self.db;
            var dbName = self.config.name;

            var result = [];

            // 最终要展示的HTML数据
            var htmlProjectList = '';
            // 打开对象存储，获得游标列表
            var objectStore = db.transaction(dbName).objectStore(dbName);
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                // 如果游标没有遍历完，继续下面的逻辑
                if (cursor) {
                    var value = cursor.value;
                    if (selectMethod(value)) {
                        result.push(value)
                    }
                    // 继续下一个游标项
                    cursor.continue();
                // 如果全部遍历完毕
                } else {
                    callback(result);
                }
            }
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
