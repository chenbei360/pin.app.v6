//获取应用实例
const app = getApp();

function run(successCallback, failCallback, completeCallback) {
  wx.request({
    url: app.globalData.apiUrl + "v1.0/project/crontab",
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