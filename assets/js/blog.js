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


    function httpRequest(obj,successfun,errFun){
        var xmlHttp = null;
        //创建 XMLHttpRequest 对象，老版本的 Internet Explorer （IE5 和 IE6）使用 ActiveX 对象：xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
        if(window.XMLHttpRequest){
            //code for all new browsers
            xmlHttp = new XMLHttpRequest;
        }else if(window.ActiveXObject){
            //code for IE5 and IE6
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //判断是否支持请求
        if(xmlHttp == null){
            alert("浏览器不支持xmlHttp");
            return;
        }
        //请求方式， 转换为大写
        var httpMethod = (obj.method || "Get").toUpperCase();
        //数据类型
        var httpDataType = obj.dataType||'json';
        //url
        var httpUrl = obj.url || '';
        //异步请求
        var async = true;
        //post请求时参数处理
        if(httpMethod=="POST"){
            //请求体中的参数 post请求参数格式为：param1=test&param2=test2
            var data = obj.data || {};
            var requestData = '';
            for(var key in data){
                requestData = requestData + key + "=" + data[key] + "&";
            }
            if(requestData == ''){
                requestData = '';
            }else{
                requestData = requestData.subString(0,requestData.length - 1);
            }
            console.log(requestData);
        }
        //onreadystatechange 是一个事件句柄。它的值 (state_Change) 是一个函数的名称，当 XMLHttpRequest 对象的状态发生改变时，会触发此函数。状态从 0 (uninitialized) 到 4 (complete) 进行变化。仅在状态为 4 时，我们才执行代码
        xmlHttp.onreadystatechange = function(){
            //complete
            if(xmlHttp.readyState == 4){
                if(xmlHttp.status == 200){
                    //请求成功执行的回调函数
                    successfun(xmlHttp.responseText);
                }else{
                    //请求失败的回调函数
                    errFun;
                }
            }
        }
        //请求接口
        if(httpMethod == 'GET'){
            xmlHttp.open("GET",httpUrl,async);
            xmlHttp.send(null);
        }else if(httpMethod == "POST"){
            xmlHttp.open("POST",httpUrl,async);
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlHttp.send(requestData);
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
            console.log(url)

            var a = {};
            var v = a.jquery && !jQuery.isPlainObject( a );
            console.log("v:", v);

            httpRequest({
                url: url,
                method: "get",
                data: {},
            }, function(json) {
                console.log("success:", json);
                // var model = IAPI.toUserModel(json);
                // callback(model);
            },function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("error:", XMLHttpRequest);
            });
            // return;
            $.ajax({
                url: url,
                type: "GET",
                data: "",
                dataType: "json",
                success: function(json) {
                    console.log("success:", json);
                    // var model = IAPI.toUserModel(json);
                    // callback(model);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error:", XMLHttpRequest);
                    // console.log("error:", XMLHttpRequest.status == 200 || XMLHttpRequest.readyState == 4);
                    // callback(null);
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
            $.ajax({
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
    };
    Blog.prototype.constructor = Blog;
    this.Blog = Blog;
})();
