//获取应用实例
const app = getApp();

function run(successCallback, failCallback, completeCallback) {
  var token = wx.getStorageSync("token");
  if(!token) return;

  wx.request({
    url: app.globalData.apiUrl + "v1.0/tokens",
    method: "DELETE",
    header: {
      'AccessToken': wx.getStorageSync("token")
    },
    success: function (res) {
      successCallback(res);
    },
    fail: function (res) {
      failCallback(res);
    },
    complete: function (res) {
      completeCallback(res);
    }
  })
}

module.exports = {
  run: run
}