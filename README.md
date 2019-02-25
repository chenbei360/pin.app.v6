 
### 安装要求
*  调试基础库 1.9.2
*  不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书

### 获取代码
```
git clone https://github.com/chenbei360/pin.app.v6
```

### 修改配置

#####   把根目录 `config.js.bak` 文件名 改成 `config.js`

 ######  config.js
```
var config = 
{
 
  apiUrl: "http://test.pintuan-xcx.cn/api/",
  miniUrl: "http://test.pintuan-xcx.cn/mini/",
 
  app: {
    url: "w5.pintuan-xcx.cn",
    name: "拼购",
    icon_url: "https://cdn.notestore.cn/w3/logo.png"
  },

  share_text: {
    title: '风靡全国的拼团商城，优质水果新鲜直供，快来一起“拼购”吧',
    path: 'pages/index'
  }
};
```


######  app.json
```
"window": {
    "navigationBarTitleText": "拼购"
  },
```