(function() {
    window.Blog = function(args) {
        this.args = $.extend(this.DefaultArguments(), args);

        this.Init();
    }
    window.Blog.prototype = {
        Init: function() {
            var self = this;
            self.api = $.extend(self.DefaultAPI(), self.GeneratePlatformAPI());
        },
        DefaultArguments: function() {
            var self = this;

            var user_name = "";
            var repositories_name = "";

            return {
                // 当前页面名称
                "self_html_name": "index.html",

                // 平台类型 选项: github, gitee
                "platform": "github",

                // 用户名称
                "user_name": user_name,

                // 项目名称
                "repositories_name": repositories_name,

                // 访问用户授权码 访问 gitee 需要用到 获取地址: https://gitee.com/api/v5/swagger
                "access_token": "",
            };
        },
        GeneratePlatformAPI: function() {
            var self = this;
            var lower = self.args.platform.toLowerCase()
            self.args.platform = lower;
            switch(lower) {
                case "github":
                    return self.APIGitHub();
                    break;
                case "gitee":
                    return self.APIGitee();
                    break;
                default:
                    self.args.platform = "github"
                    return self.GeneratePlatformAPI();
            }
        },
        DefaultAPI: function() {
            var self = this;
            return {
                // 请求获取所有文件地址的地址
                "filesurl": "",
            };
        },
        APIGitHub: function() {
            var self = this;
            return {
                "filesurl": "https://api.github.com/repos/" + self.args.user_name + "/" + self.args.repositories_name,
                "callback": function(json) {
                    console.log("github json: ", json)
                },
            };
        },
        APIGitee: function() {
            var self = this;
            return {
                "filesurl": "https://gitee.com/api/v5/repos/" + self.args.user_name + "/" + self.args.repositories_name + "/git/gitee/trees/master?recursive=1",
                "callback": function(json) {
                    console.log("gitee json: ", json);
                    var tree = json.tree;

                    var root = "https://"+self.args.user_name+".gitee.io/"+self.args.repositories_name+"/";

                    var box = $("#ID_Box_Directory");
                    var himg = $("#ID_HTML_IMG");
                    var hfile = $("#ID_HTML_File");
                    for (var i = 0; i < tree.length; i++) {
                        var model = tree[i]
                        if (model.type === "tree") {
                            console.log("tree 目录: ", model.path);
                            continue;
                        }

                        if (/(jpg|png|gif)$/gi.test(model.path)) {
                            var item = window.PageInfo.RenderingHTML(himg, {
                                "path": root + model.path,
                            });
                            box.append(item)
                        } else {
                            self.RequestFilsContent(root + model.path, function(text) {
                                var item = window.PageInfo.RenderingHTML(hfile, {
                                    "content": text,
                                });
                                box.append(item)
                            });
                        }
                    }
                },
            };
        },
        RequestFilsInfo: function() {
            var self = this;
            window.AjaxRequest.LocalGet({
                url: self.api.filesurl,
                EventSuccess: function(json) {
                    self.api.callback(json);
                },
            });
        },
        RequestFilsContent: function(fileurl, callback) {
            var self = this;
            $.get(fileurl, function (data, textStauts) {
                console.log("textStauts:", textStauts, "data:", data);
                callback(data)
            });
            // window.AjaxRequest.LocalGet({
            //     url: fileurl,
            //     EventSuccess: function(text) {
            //         callback(text);
            //     },
            // });
        }
    };
})();
