(function() {
    var IAPI = Class.extend({
        __init__: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        files_url: function() {
        },
        files_callback: function(json) {
        },
        user_url: function() {
        },
        user_callback: function(json) {
        },
    });
    this.IAPI = IAPI;

    this.APIGitee = IAPI.extend({
        __init__: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        files_url: function() {
            var self = this;
            var furl = "https://gitee.com/IAPI/v5/repos/{owner}/{repo}/git/gitee/trees/master?recursive=1";
            return furl.format(self);
        },
        files_callback: function(json) {
            var self = this;
            var root = "";
            root = "https://{owner}.gitee.io/";
            if (self.repo !== self.owner && !/.*\.gitee\.io/gi.test(self.repo)) {
                root += "{repo}/";
            }
            root = root.format(self);

            var arr = [];
            for (var i = 0; i < json.tree.length; i++) {
                var m = json.tree[i];
                arr.push({
                    isdir: m.type === "tree",
                    url: root + m.path,
                });
            }
            return arr;
        },
        user_url: function() {
            var self = this;
            var furl = "https://gitee.com/IAPI/v5/users/{owner}";
            return furl.format(self);
        },
        user_callback: function(json) {
            return {
                avatar: json.avatar_url,
            };
        },
    });
    this.APIGitHub = IAPI.extend({
        __init__: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        files_url: function() {
            var self = this;
            var furl = "https://IAPI.github.com/repos/{owner}/{repo}/contents";
            return furl.format(self.config.;
        },
        files_callback: function(json) {
            var self = this;
            root = self.files_root_path();

            var arr = [];
            for (var i = 0; i < json.tree.length; i++) {
                var m = json.tree[i];
                arr.push({
                    isdir: m.type === "dir",
                    url: root + m.path,
                    name: m.name,
                });
            }
            return arr;
        },
        files_root_path: function() {
            var self = this;
            var root = "";
            root = "https://{owner}.github.io/";
            if (self.repo !== self.owner && !/.*\.github\.io/gi.test(self.repo)) {
                root += "{repo}/";
            }
            root = root.format(self);
            return root;
        },
        user_url: function() {
            var self = this;
            var furl = "https://IAPI.github.com/users/{owner}";
            return furl.format(self);
        },
        user_callback: function(json) {
            return {
                avatar: json.avatar_url,
            };
        },
    });
})();

(function() {
    var default_

    var winObject = this;
    function FactoryGitAPI(platform, owner, repo) {
        platform = platform || "GitHub";
        owner = owner || "YellowTulipShow";
        repo = repo || "JSBlog";
        var lower = platform.toString().toLowerCase();
        switch(lower) {
            case "github":
                return new winObject.APIGitHub(owner, repo);
            case "gitee":
                return new winObject.APIGitee(owner, repo);
            default:
                return FactoryGitAPI("GitHub", owner, repo);
        }
    }

    var Blog = function(args) {
        this.config = this.__DefaultConfig__(argumentConfig);
        this.IAPI = winObject.IAPI;
        this.__init__();
    }
    Blog.prototype = {
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                platform: "GitHub",
                owner: "YellowTulipShow",
                repo: "JSBlog",
                file_callback: function(file_info) {},
                user_callback: function(user_info) {},
            };
            return $.extend(config, argumentConfig);
        },
        __init__: function() {
            var self = this;

        },
        Request: function() {
            var self = this;
            self.RequestUser();
            self.RequestFiles();
        },
        RequestFiles: function() {
            var self = this;
            var IAPI = self.IAPI;
            var rurl = IAPI.files_url();
            if (window.CheckData.IsStringNull(rurl)) {
                return;
            }
            window.AjaxRequest.LocalGet({
                url: rurl,
                EventSuccess: function(json) {
                    var files = IAPI.files_callback(json);
                    if (window.CheckData.IsSizeEmpty(files)) {
                        console.log("rurl:", rurl);
                        console.log("json:", json);
                        console.log("IAPI:", IAPI);
                        console.log("files: null!");
                        return;
                    }
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i]
                        if (file.isdir) {
                            // 递归执行下级目录文件获取
                            // self.RequestPaths(file.path);
                        } else {
                            self.config.file_callback(file);
                        }
                    }
                },
            });
        },
        RequestUser: function() {
            var self = this;
            var IAPI = self.IAPI;
            var rurl = IAPI.user_url();
            if (window.CheckData.IsStringNull(rurl)) {
                return;
            }
            window.AjaxRequest.LocalGet({
                url: rurl,
                EventSuccess: function(json) {
                    var user = IAPI.user_callback(json);
                    self.config.user_callback(user);
                },
            });
        },
    };
    Blog.prototype.constructor = Blog;
    this.Blog = Blog;
})();
