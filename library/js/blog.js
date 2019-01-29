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
                "callback": function(file_info) {},
            };
        },
        PlatformAPI: function() {
            var self = this;
            var def_api = self.APIGitHub();

            var lower = self.args.platform.toLowerCase()
            self.args.platform = lower;
            switch(lower) {
                case "github":
                    return def_api
                    break;
                case "gitee":
                    return $.extend(def_api, self.APIGitee());
                    break;
                default:
                    self.args.platform = "github"
                    return self.PlatformAPI();
            }
        },
        APIGitHub: function() {
            var self = this;
            return {
                url: function(directory) {
                    "https://api.github.com/repos/{owner}/{repo}/contents"
                    var furl = "https://api.github.com/repos/{owner}/{repo}";
                    furl.format(self.args);
                },
                paths: function(json) {
                    console.log("github json: ", json)
                },
            };
        },
        APIGitee: function() {
            var self = this;
            return {
                url: function(directory) {
                    if (/gitee\.com\/api\//gi.test(directory)) {
                        return directory;
                    }
                    var furl = "https://gitee.com/api/v5/repos/{owner}/{repo}/git/gitee/trees/master?recursive=1";
                    return furl.format(self.args);
                },
                paths: function(json) {
                    console.log("gitee json: ", json);

                    var root = "";
                    if (self.args.repo == self.args.owner || self.args.repo == self.args.owner + ".gitee.io") {
                        root = "https://{owner}.gitee.io/";
                    } else {
                        root = "https://{owner}.gitee.io/{repo}/";
                    }
                    root = root.format(self.args);

                    var arr = [];
                    for (var i = 0; i < json.tree.length; i++) {
                        var m = json.tree[i]
                        if (m.type === "tree") {
                            continue;
                        }
                        var info = self.Info(false, root + m.path);
                        arr.push(info);
                    }
                    return arr;
                },
            };
        },
        Info: function(isdirectory, url, name, path) {
            var self = this;
            return {
                isdir: isdirectory,
                url: url,
                name: name,
                path: path,
            };
        },
        Request: function() {
            var self = this;
            self.RequestPaths(".");
        },
        RequestPaths: function(directory) {
            var self = this;
            var api = self.api;
            var rurl = api.url(directory);
            if (window.CheckData.IsStringNull(rurl)) {
                return;
            }
            window.AjaxRequest.LocalGet({
                url: rurl,
                EventSuccess: function(json) {
                    var paths = api.paths(json);
                    if (window.CheckData.IsSizeEmpty(paths)) {
                        console.log("rurl:", rurl);
                        console.log("json:", json);
                        console.log("api:", api);
                        console.log("paths: null!");
                        return;
                    }
                    for (var i = 0; i < paths.length; i++) {
                        var info = paths[i]
                        if (info.isdir) {
                            self.RequestPaths(info.path);
                        } else {
                            self.args.callback(info);
                        }
                    }
                },
            });
        },
        RequestFilsContent: function(fileurl, callback) {
            var self = this;
            $.get(fileurl, function (data, textStauts) {
                console.log("textStauts:", textStauts, "data:", data);
                callback(data)
            });

            // ------

            // window.AjaxRequest.LocalGet({
            //     url: fileurl,
            //     EventSuccess: function(text) {
            //         callback(text);
            //     },
            // });

            // ------

            var url = "";
            url = "https://ytsimg.gitee.io/anime/README.md";
            url = "http://code.jquery.com/jquery-2.1.1.min.js";
            url = "http://127.0.0.1:5552/README.md";
            url = "https://yellowtulipshow.github.io/css/base.css";

            var box = $("#ID_Box_Directory");
            var himg = $("#ID_HTML_IMG");
            var hfile = $("#ID_HTML_File");

            var ar = $.ajax({
                url: url,
                dataType: "plain",
                success: function(text) {
                    console.log("success text:", text);
                    var item = window.PageInfo.RenderingHTML(hfile, {
                        "content": text,
                    });
                    box.append(item)
                },
                error: function(xtr, tx, et) {
                    console.log("error xtr:", xtr, "tx:", tx, "et:", et);
                },
                complete: function(xtr, tx) {
                    console.log("complete xtr:", xtr, "tx:", tx);
                },
            });
        }
    };
})();