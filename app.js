//app.js
function debugConsole(e) {
  console.log(e);
}

var loginCode = null;


App({
  onLaunch: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.globalData.userInfo = res.data;
      },
      fail: function (res) {
        debugConsole(res);
      }
    });

    wx.getSystemInfo({
      success: function (res) {
        debugConsole(res);
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.device = res.model;
        if (res.model.search("iPhone X") != -1) {
          that.globalData.isIphonex = true;
        }
      },
    });
  },
  

  login: function (successCallback, failCallback) {
    var that = this;

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          debugConsole("app wx.login success：" + res.code);

          loginCode = res.code;

          that.getWxUserInfo(successCallback, failCallback);

        } else {
          debugConsole('获取用户登录态失败：' + res.errMsg);
        }
      },

      fail: function () {
        debugConsole('wx.login fail');
      }
    });
  },

  getUserInfo: function (successCallback, failCallback) {
    console.log("app.getUserInfo");
    var that = this;
    wx.checkSession({
      success: function () {
        if (!wx.getStorageSync("token")) {
          that.login(successCallback, failCallback);
          return;
        }

        if (that.globalData.userInfo == null) {
          wx.getStorage({
            key: 'userInfo',
            success: function (res) {
              that.globalData.userInfo = res.data;
              successCallback(that.globalData.userInfo);
            },
            fail: function (res) {
              that.login(successCallback, failCallback);
            }
          });
        } else {
          successCallback(that.globalData.userInfo);
        }
      },

      fail: function () {
        console.log("app.checkseesion fail");
        // 登录
        that.login(successCallback, failCallback);
      },

      complete: function () {
        console.log("app.checksession complete");
      }
    });

  },

  getWxUserInfo: function (successCallback, failCallback) {
    var that = this;

    wx.getUserInfo({
      success: res => {

        debugConsole("app wx.getUserInfo success");

        if (that.isLogining) {
          return;
        }

        that.isLogining = true;

        wx.request({
          url: this.globalData.miniUrl + "v1.0/login",
          data: {
            code: loginCode,
            rawData: res.rawData,
            signature: res.signature,
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          success: function (respone) {
            debugConsole(respone);

            that.globalData.userInfo = res.userInfo

            if (respone.data.result == 'ok') {
              wx.setStorage({
                key: "userInfo",
                data: res.userInfo
              });

              wx.setStorage({
                key: 'token',
                data: respone.data.token,
                success: function () {
                  successCallback(res.userInfo);
                }
              });

            }
          },
          complete: function (res) {
            that.isLogining = false;
          }
        });
      },
      fail: function () {
        debugConsole("app wx.getUserInfo fail");
      },
      complete: function (e) {
        debugConsole("app wx.getUserInfo complete");
        debugConsole(e);
        if (e.errMsg != "getUserInfo:ok") {
          failCallback();
        }
      }
    });
  },

  getImageUrlInfo: function (page,image_url, loadingCallback, successCallback, failCallback) {
    var that = this, image_url_c = "image_" + image_url,image_w_h =  wx.getStorageSync(image_url_c);

    if(image_w_h){
      successCallback(image_w_h) 
    }else{
      loadingCallback();
      const ImgLoader = require('/libs/img-loader/img-loader.js')
      page.imgLoader = new ImgLoader(page);
      page.imgLoader.load(image_url, function (err, imgs) {
        image_w_h = imgs.ev.detail;
        wx.setStorageSync(image_url_c,image_w_h);
        successCallback(image_w_h);
      });
    }
  },

/***
 * 计算宽高
 */
  wxAutoImageCal: function (originalWidth, originalHeight) {
    var windowWidth = 0, windowHeight = 0;
    var autoWidth = 0, autoHeight = 0;
    var results = {};

    windowWidth = this.globalData.windowWidth;
    windowHeight = this.globalData.windowHeight;
    
    if (originalWidth > windowWidth) {
      autoWidth = windowWidth;
      autoHeight = (autoWidth * originalHeight) / originalWidth;
      results.imageWidth = autoWidth;
      results.imageheight = autoHeight;
    } else {
      results.imageWidth = originalWidth;
      results.imageheight = originalHeight;
    }

    debugConsole(results);
    return results;
  },

  share: function (data) {
    var share_text = this.globalData._.config.share_text,
    share_type = '分享给好友',
    that = this,
    path = data.path || share_text.path,
    title = data.title || share_text.title;

    return {
      title: title,
      path: path,
      withShareTicket: true,
      success: function (res) {
        if (res.shareTickets != undefined && res.shareTickets.length > 0) share_type = "分享给群聊";
        that.handlerShare(share_type, 1, path);
      },
      fail: function (res) {
        that.handlerShare(share_type, 0, path);
      }
    }
  },

  handlerShare(share_type, share_status, path) {
    var token = wx.getStorageSync("token");
    wx.request({
      url: this.globalData.apiUrl + 'v1.0/users/share',
      method: "POST",
      data: {
        share_type: share_type,
        share_status: share_status,
        share_url: path
      },
      header: {
        'AccessToken': token
      }
    });
  },

  globalData: {
    userInfo: null,
    isIphonex: false,
    apiUrl: "http://192.168.9.136/api/",
    miniUrl: "http://192.168.9.136/mini/",
    device: "",
    windowHeight: "",
    windowWidth: "",
    _: require('./config.js')
  }
})