<!--
Feature Requests:
  Please read https://github.com/jquery/jquery/wiki/Adding-new-features
  Most features should start as plugins outside of jQuery.

Bug Reports:
  Note that we only can fix bugs in the latest version of jQuery.
  Briefly describe the issue you've encountered
  *  What do you expect to happen?
  *  What actually happens?
  *  Which browsers are affected?
  Provide a *minimal* test case, see https://webkit.org/test-case-reduction/
  Use the latest shipping version of jQuery in your test case!
  We prefer test cases on JS Bin (https://jsbin.com/qawicop/edit?html,css,js,output) or CodePen (https://codepen.io/mgol/pen/wNWJbZ)

Frequently Reported Issues:
  * Selectors with '#' break: See https://github.com/jquery/jquery/issues/2824
-->


# A very normal $ .ajax.get request but an error occurred on request: SyntaxError: Invalid header name.

(一个非常正常的$.ajax.get要求 但是在请求时发生错误: SyntaxError: Invalid header name.)

## An error occurred The browser used for debugging is:

(发生错误 用于调试的浏览器为:)

* Firefox Browser 72.0.1 (64)
* Google Chrome 74.0.3729.131 (64)

## Use Code:

```js
Object.prototype.getValue = function(name, default_value) {
    if (arguments.length <= 0) {
        return null;
    }
    name = name.toString();
    var value = this[name];
    return value ? value : default_value;
}
```

```js
var url = "https://api.github.com/users/YellowTulipShow";
$.ajax({
    url: url,
    type: "GET",
    data: {},
    dataType: "json",
    success: function(json) {
        console.log("success:", json);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("error:", XMLHttpRequest);
    },
    complete: function(XMLHttpRequest, TypeStatus) {
        console.log("complete: url:", url);
    },
});
```

When requesting the parameter `data`, either:` (} `or` "" `The empty string will report the above error,

(请求时的参数 `data` 无论是: `{}` 或者 `""` 空字符串都会报以上错误)
