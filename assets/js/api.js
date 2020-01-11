(function() {
    var IAPI = Class.extend({
        __init__: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        toUserURL: function() { },
        toUserModel: function(jsonResult) { },
        toRepoContentURL: function(path) { },
        toRepoContentModel: function(jsonResult) { },
    });
    IAPI.modelUser = function() {
        return {
            "name": "",
            "type": "",
            "address": "",
            "email": "",
            "created_time": "",
            "updated_time": "",
            "url": "",
            "url_avatar": "",
            "url_html": "",
        };
    }
    IAPI.modelRepoContent = function() {
        return {
            "name": "",
            "path": "",
            "sha": "",
            "size": 0,
            "type": "dir", // dir, file
            "url": "",
            "url_html": "",
            "url_git": "",
            "url_download": "",
            "link": "",
            "link_git": "",
            "link_html": "",
            "content": "",
            "encoding": "",
        };
    }
    this.IAPI = IAPI;

    this.APIGitHub = IAPI.extend({
        __init__: function(owner, repo) {
            this.owner = owner;
            this.repo = repo;
        },
        toUserURL: function() {
            var self = this;
            var temp = "https://api.github.com/users/{owner}";
            return temp.format({
                owner: self.owner,
            });
        },
        toUserModel: function(jsonResult) {
            console.log('github.toUserModel');
            var self = this;
            var j = jsonResult;
            if (j.getValue("message", null) == null) {
                return null;
            }
            var model = IAPI.modelUser();
            model = $.extend(model, {
                "name": getValue(j, "name", ""),

                "type": j.getValue("type", ""),
                "address": j.getValue("location", ""),
                "email": j.getValue("email", ""),
                "created_time": j.getValue("created_at", ""),
                "updated_time": j.getValue("updated_at", ""),
                "url": j.getValue("url", ""),
                "url_avatar": j.getValue("avatar_url", ""),
                "url_html": j.getValue("html_url", ""),
            });
            return model;
        },
        toRepoContentURL: function(path) {
            var self = this;
            var endChar = "/";
            var value = path.toString() || endChar;
            value = value.trim(endChar);
            var temp = "https://api.github.com/repos/{owner}/{repo}/contents/{path}";
            var url = temp.format({
                owner: self.owner,
                repo: self.repo,
                path: value,
            });
            return url.trim(endChar)
        },
        toRepoContentModel: function(jsonResult) {
            var self = this;
            var j = jsonResult;
            if (j.getValue("message", null) == null) {
                return null;
            }
            var model = IAPI.modelRepoContent();
            model = $.extend(model, {
                "name": j.getValue("name", ""),
                "path": j.getValue("path", ""),
                "sha": j.getValue("sha", ""),
                "size": j.getValue("size", 0),
                "type": j.getValue("type", "dir"),
                "content": j.getValue("content", ""),
                "encoding": j.getValue("encoding", ""),
                "url": j.getValue("url", ""),
                "url_html": j.getValue("html_url", ""),
                "url_git": j.getValue("git_url", ""),
                "url_download": j.getValue("download_url", ""),
                "link": j.getValue("_links", {}).getValue("self", ""),
                "link_git": j.getValue("_links", {}).getValue("git", ""),
                "link_html": j.getValue("_links", {}).getValue("html", ""),
            });
            return model;
        },
    });
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
})();
