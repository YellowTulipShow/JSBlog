(function() {
    window.Blog = function(args) {
        this.args = $.extend(this.DefaultArguments(), args);
        this.api = this.PlatformAPI();
        this.paths = [];
        this.Init();
    }
    window.Blog.prototype = {
        Init: function() {
            var self = this;
        },
        DefaultArguments: function() {
            var self = this;
            return {
                // 当前页面名称
                "self_html_name": "index.html",

                // 平台类型 选项: github, gitee
                "platform": "github",

                // 用户名称
                "owner": "",

                // 项目名称
                "repo": "",

                // 回调文件信息处理
                "file_callback": function(file_info) {},

                // 用户信息回调
                "user_callback": function(user_info) {},
            };
        },
        PlatformAPI: function() {
            var self = this;
            var lower = self.args.platform.toLowerCase()
            self.args.platform = lower;
            switch(lower) {
                case "github":
                    return new window.APIGitHub(self.args.owner, self.args.repo);
                    break;
                case "gitee":
                    return new window.APIGitee(self.args.owner, self.args.repo);
                    break;
                default:
                    self.args.platform = "github"
                    return self.PlatformAPI();
            }
        },
        Request: function() {
            var self = this;
            self.RequestUser();
            self.RequestFiles();
        },
        RequestFiles: function() {
            var self = this;
            var api = self.api;
            var rurl = api.files_url();
            if (window.CheckData.IsStringNull(rurl)) {
                return;
            }
            window.AjaxRequest.LocalGet({
                url: rurl,
                EventSuccess: function(json) {
                    var files = api.files_callback(json);
                    if (window.CheckData.IsSizeEmpty(files)) {
                        console.log("rurl:", rurl);
                        console.log("json:", json);
                        console.log("api:", api);
                        console.log("files: null!");
                        return;
                    }
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i]
                        if (file.isdir) {
                            // 递归执行下级目录文件获取
                            // self.RequestPaths(file.path);
                        } else {
                            self.args.file_callback(file);
                        }
                    }
                },
            });
        },
        RequestUser: function() {
            var self = this;
            var api = self.api;
            var rurl = api.user_url();
            if (window.CheckData.IsStringNull(rurl)) {
                return;
            }
            window.AjaxRequest.LocalGet({
                url: rurl,
                EventSuccess: function(json) {
                    var user = api.user_callback(json);
                    self.args.user_callback(user);
                },
            });
        },
    };

})();
(function() {
    window.APIGitee = Class.extend({
        init: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        files_url: function() {
            var self = this;
            var furl = "https://gitee.com/api/v5/repos/{owner}/{repo}/git/gitee/trees/master?recursive=1";
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
            var furl = "https://gitee.com/api/v5/users/{owner}";
            return furl.format(self);
        },
        user_callback: function(json) {
            return {
                avatar: json.avatar_url,
            };
        },
    });
    window.APIGitHub = APIGitee.extend({
        init: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        files_url: function() {
            var self = this;
            var furl = "https://api.github.com/repos/{owner}/{repo}/contents";
            return furl.format(self.args);
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
            var furl = "https://api.github.com/users/{owner}";
            return furl.format(self);
        },
        user_callback: function(json) {
            return {
                avatar: json.avatar_url,
            };
        },
    });
})();
