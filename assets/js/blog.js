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
        this.__init__();
    }
    Blog.prototype = {
        __DefaultConfig__: function(argumentConfig) {
            var config = {
                platform: default_platform,
                owner: default_owner,
                repo: default_repo,
            };
            return $.extend(config, argumentConfig);
        },
        __init__: function() {
            var self = this;
        },
        RequestUser: function(callback) {
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toUserURL();
            var request = new WebRequest({});
            request.Send({
                url: url,
                type: "GET",
                data: "",
                dataType: "json",
                success: function(json) {
                    var model = IAPI.toUserModel(json);
                    callback(model);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error:", XMLHttpRequest);
                },
                complete: function(XMLHttpRequest, TypeStatus) {
                    console.log("请求完成: url:", url);
                },
            });
        },
        RequestRepoContent: function(callback, path) {
            path = path || "/";
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);
            var request = new WebRequest({});
            request.Send({
                url: url,
                type: "GET",
                data: {},
                dataType: "json",
                success: function(json) {
                    var model = IAPI.toRepoContentModel(json);
                    callback(model);
                },
                error: function(XMLHttpRequest_obj, textStatus_obj, errorThrown_obj) {
                    callback(null);
                },
                complete: function(XMLHttpRequest_obj, TypeStatus) {
                    console.log("请求完成: url:", url);
                },
            });
        },
        RequestRepoFile: function(callback, path) {
            path = path || "/";
            var self = this;
            var IAPI = self.IAPI;
            var url = IAPI.toRepoContentURL(path);
            var request = new WebRequest({});
            request.Send({
                url: url,
                type: "GET",
                data: {},
                dataType: "json",
                success: function(json) {
                    var model = IAPI.toRepoFileModel(json);
                    callback(model);
                },
                error: function(XMLHttpRequest_obj, textStatus_obj, errorThrown_obj) {
                    callback(null);
                },
                complete: function(XMLHttpRequest_obj, TypeStatus) {
                    console.log("请求完成: url:", url);
                },
            });
        },
    };
    Blog.prototype.constructor = Blog;
    this.Blog = Blog;
})();
