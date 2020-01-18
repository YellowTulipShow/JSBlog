# 错误报告

## 多频率调用API报错

### GitHub API

```json
{
  "message": "API rate limit exceeded for 218.201.100.226. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
  "documentation_url": "https://developer.github.com/v3/#rate-limiting"
}
```

每小时有 `60` 个请求的限制

例如:
```shell
curl -i https://api.github.com/users/octocat

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1298  100  1298    0     0    417      0  0:00:03  0:00:03 --:--:--   417HTTP/1.1 200 OK
Date: Sat, 18 Jan 2020 01:35:35 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 1298
Server: GitHub.com
Status: 200 OK
X-RateLimit-Limit: 60           # 每小时最多请求的次数
X-RateLimit-Remaining: 58       # 每小时剩余请求次数
X-RateLimit-Reset: 1579314916   # 下次刷新请求次数的时间点(时间戳单位是秒 js计算: new Date(1579314916 * 1000);)
Cache-Control: public, max-age=60, s-maxage=60
Vary: Accept
ETag: "f6d15af8b6713dcdd14ff80700133a4d"
Last-Modified: Thu, 02 Jan 2020 15:35:57 GMT
X-GitHub-Media-Type: github.v3; format=json
Access-Control-Expose-Headers: ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type
Access-Control-Allow-Origin: *
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
X-Frame-Options: deny
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'
Vary: Accept-Encoding
X-GitHub-Request-Id: 2EA8:6294:AED69:D8E35:5E2260E4

{
  "login": "octocat",
  "id": 583231,
  "node_id": "MDQ6VXNlcjU4MzIzMQ==",
  "avatar_url": "https://avatars3.githubusercontent.com/u/583231?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/octocat",
  "html_url": "https://github.com/octocat",
  "followers_url": "https://api.github.com/users/octocat/followers",
  "following_url": "https://api.github.com/users/octocat/following{/other_user}",
  "gists_url": "https://api.github.com/users/octocat/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/octocat/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/octocat/subscriptions",
  "organizations_url": "https://api.github.com/users/octocat/orgs",
  "repos_url": "https://api.github.com/users/octocat/repos",
  "events_url": "https://api.github.com/users/octocat/events{/privacy}",
  "received_events_url": "https://api.github.com/users/octocat/received_events",
  "type": "User",
  "site_admin": false,
  "name": "The Octocat",
  "company": "GitHub",
  "blog": "http://www.github.com/blog",
  "location": "San Francisco",
  "email": null,
  "hireable": null,
  "bio": null,
  "public_repos": 8,
  "public_gists": 8,
  "followers": 2916,
  "following": 9,
  "created_at": "2011-01-25T18:44:36Z",
  "updated_at": "2020-01-02T15:35:57Z"
}
```

根据此情况问题, 解决办法就只能是在本地生成文章目录, 图片各类资源的目录地址放置到 配置文件中, 以减少API请求的次数

当然是可以用户授权获得更多授权的次数, 但这样与快捷使用的目的不符, 只适用于不在意的用户
