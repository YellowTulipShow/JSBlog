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
            "encoding": "", // base64,
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
            var self = this;
            var j = jsonResult;
            if (Object.get(j, "message", null) != null) {
                return null;
            }
            var model = $.extend(IAPI.modelUser(), {
                "name": Object.get(j, "name", ""),
                "type": Object.get(j, "type", ""),
                "address": Object.get(j, "location", ""),
                "email": Object.get(j, "email", ""),
                "created_time": Object.get(j, "created_at", ""),
                "updated_time": Object.get(j, "updated_at", ""),
                "url": Object.get(j, "url", ""),
                "url_avatar": Object.get(j, "avatar_url", ""),
                "url_html": Object.get(j, "html_url", ""),
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
            if (Object.get(j, "message", null) != null) {
                return null;
            }
            if (typeof(j) == "object" && typeof(j.length) == "number") {
                for (var i = 0; i < j.length; i++) {
                    j[i] = self.toRepoContentModel(j[i]);
                }
                return j;
            }
            var model = $.extend(IAPI.modelRepoContent(), {
                "name": Object.get(j, "name", ""),
                "path": Object.get(j, "path", ""),
                "sha": Object.get(j, "sha", ""),
                "size": Object.get(j, "size", 0),
                "type": Object.get(j, "type", "dir"),
                "url": Object.get(j, "url", ""),
                "url_html": Object.get(j, "html_url", ""),
                "url_git": Object.get(j, "git_url", ""),
                "url_download": Object.get(j, "download_url", ""),
                "link": Object.get(Object.get(j, "_links", {}), "self", ""),
                "link_git": Object.get(Object.get(j, "_links", {}), "git", ""),
                "link_html": Object.get(Object.get(j, "_links", {}), "html", ""),
                "content": Object.get(j, "content", ""),
                "encoding": Object.get(j, "encoding", ""),
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
