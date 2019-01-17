var util = require('./utils/util.js')
App({
  onLaunch: function () {
    if(!wx.getStorageSync('token')) {this.login();}
    console.log("%c :) 欢迎使用 Weipin5商业版 之v5.0.0 , 现在开启你的小程序部署之旅吧", 'color: #1aad19;font-size:12px;');
  },
  onShow: function () {},
  onHide: function () {},
  share: function (obj) {
    var token = wx.getStorageSync('token');
    var baseApiUrl = util.config('baseApiUrl'); 
    var url = baseApiUrl + "/Api/Weuser/share?token=" + token;    
    var share_text = util.config('share_text');
    var share_type = '分享给好友';
    
    return {
      title: obj.title || share_text.title,
      path: obj.path || share_text.path,
      withShareTicket : true,
      success : function(res) {
        if(res.shareTickets != undefined && res.shareTickets.length > 0) share_type = "分享给群聊";

        util.ajax({url: url,data: {'share_type' : share_type,'share_status' : 1,'share_url' : obj.path || share_text.path},method : "POST",success : function(e) {}});
      },
      fail : function(res) {
         util.ajax({url: url,data: {'share_type' : share_type,'share_status' : 0,'share_url' : obj.path || share_text.path},method : "POST",success : function(e) {}});
      }
    }
  },
  login : function(obj={}) {
    var baseApiUrl = util.config('baseApiUrl'); 
     var _self = this;
     wx.login({
      success: function(res) {
        if (res.code) {
          var url = baseApiUrl + "/api/weapp/login?code=" + res.code;
          util.ajax({
              "url" :  url,
              "method" :　"GET",
              "success" : function(data) {
                 var token = data.token;
                 if(data.result == "ok") {
                    wx.setStorageSync('token',token);
                    _self.getUserInfo(token);
                    if(obj.success != undefined) {
                      obj.success(token);
                    }
                 } 
              }
          });
        } else {
           if(obj.error != undefined) {obj.error();}
           console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfo : function(token,success=null) {
     var baseApiUrl = util.config('baseApiUrl'); 
     var url = baseApiUrl + "/api/WeApp/login?token=" + token;    
     var data = [];
     wx.getUserInfo({
        success: function(res) {
          util.ajax({
            "url" :  url,
            "data" : res,
            "method" :　"PUT",
            "success" : function(data) {
              if(typeof (success) == "function") 
              {
                 success();
              } 
            }
          })
        },
        fail: function(res) {}
     })
  },
})