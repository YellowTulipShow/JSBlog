(function() {
    var default_platform = "GitHub",
        default_owner = "YellowTulipShow",
        default_repo = "JSBlog";

    var winObject = this;
    function FactoryGitAPI(platform, owner, repo) {
        platform = platform.toString() || default_platform;
        owner = owner || default_owner;
        repo = repo || default_repo;
        var lower = platform.toLowerCase();
        switch(lower) {
            case "github":
                return new winObject.APIGitHub(owner, repo);
            case "gitee":
                return new winObject.APIGitee(owner, repo);
            default:
                return FactoryGitAPI("GitHub", owner, repo);
        }
    }

    var Blog = function(argumentConfig) {
        this.config = this.__DefaultConfig__(argumentConfig);
        this.IAPI = FactoryGitAPI(this.config.platform, this.config.owner, this.config.repo);
        this.db = null;
        this.__init__();
    }
    Blog.prototype = {
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                platform: default_platform,
                owner: default_owner,
                repo: default_repo,
                isSave: false,
                dbOpenError: function() {},
                dbOpenSuccess: function() {},
            };
            return $.extend(config, argumentConfig);
        },
        __init__: function() {
            var self = this;
            try {
                self.__init_database__();
            } catch(ex) {
                self.db = null;
                console.log("数据库实例化出现错误:", ex);
            }
        },
        __init_database__: function() {
            var self = this;
            if (!self.config.isSave) {
                return;
            }

            self.db = new dbStore({
                "name": self.DBName(),
                "fields": [
                    { name: "path", isSign: true, isUnique: true, },
                    { name: "value" },
                ],
                dbOpenError: function() {
                    self.config.dbOpenError();
                },
                dbOpenSuccess: function() {
                    self.config.dbOpenSuccess();
                },
            });
        },
        DBName: function() {
            var self = this;
            return "{platform}/{owner}/{repo}".format(self.config);
        },
        RequestGet: function(url, callback) {
            var self = this;
            var IAPI = self.IAPI;
            var request = new WebRequest({});
            request.Send({
                url: url,
                type: "GET",
                data: {},
                dataType: "json",
                success: function(json) {
                    callback(json);
                },
                error: function(XMLHttpRequest_obj, textStatus_obj, errorThrown_obj) {
                    callback(null);
                },
                complete: function(XMLHttpRequest_obj, TypeStatus) {
                    console.log("请求完成: url:", url);
                },
            });
        },
        RequestGet_DBAutoSave: function(url, callback) {
            var self = this;
            self.db.Query(function(model) {
                return model.path == url;
            }, function(result_list) {
                if (result_list == null || result_list.length <= 0) {
                    self.RequestGet(url, function(json) {
                        self.db.Insert({
                            path: url,
                            value: json,
                        }, function(model) {
                            console.log("成功保存数据:", model);
                        });
                        callback(json);
                    });
                    return;
                }
                callback(self.DBRequeseToURLModel(result_list));
            });
        },
        DBRequeseToURLModel: function(dbResultList) {
            if (dbResultList == null || dbResultList.length <= 0) {
                return null;
            }
            if (dbResultList.length == 1) {
                return Object.get(dbResultList[0], "value", {});
            }
            var list = [];
            for (var i = 0; i < dbResultList.length; i++) {
                var item = dbResultList[i];
                var model = Object.get(item, "value", {});
                list.push(model);
            }
            return list;
        },
        RequestUser: function(callback) {
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toUserURL();

            if (self.db != null) {
                self.RequestGet_DBAutoSave(url, function(json) {
                    var model = IAPI.toUserModel(json);
                    callback(model);
                });
                return;
            }

            self.RequestGet(url, function(json) {
                var model = IAPI.toUserModel(json);
                callback(model);
            });
        },
        RequestRepoContent: function(callback, path) {
            path = path || "/";
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);

            if (self.db != null) {
                self.RequestGet_DBAutoSave(url, function(json) {
                    var model = IAPI.toRepoContentModel(json);
                    callback(model);
                });
                return;
            }

            self.RequestGet(url, function(json) {
                var model = IAPI.toRepoContentModel(json);
                callback(model);
            });
        },
        RequestRepoFile: function(callback, path) {
            path = path || "/";
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);

            if (self.db != null) {
                self.RequestGet_DBAutoSave(url, function(json) {
                    var model = IAPI.toRepoFileModel(json);
                    callback(model);
                });
                return;
            }

            self.RequestGet(url, function(json) {
                var model = IAPI.toRepoFileModel(json);
                callback(model);
            });
        },
        RefreshUser: function(callback) {
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toUserURL();

            if (self.db != null) {
                self.Delete(url, function(url) {
                    self.RequestUser(callback);
                });
                return;
            }
            self.RequestUser(callback);
        },
        RefreshRepoContent: function(callback, path) {
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);

            if (self.db != null) {
                self.Delete(url, function(url) {
                    self.RequestRepoContent(callback, path);
                });
                return;
            }
            self.RequestRepoContent(callback, path);
        },
        RefreshRepoFile: function(callback, path) {
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);

            if (self.db != null) {
                self.Delete(url, function(url) {
                    self.RequestRepoFile(callback, path);
                });
                return;
            }
            self.RequestRepoFile(callback, path);
        },
    };
    Blog.prototype.constructor = Blog;
    this.Blog = Blog;
})();
