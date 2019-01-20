// pages/group.js
//获取应用实例
const app = getApp();
var groupOrderId = 0;
Page({


  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    isHideLoadMore: true,
    isNoNetError: true
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.orders = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/groups/' + groupOrderId,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success: function (res) {
        that.setData({
          group_order: res.data.group_order
        });

        that.setData({
          isNoNetError: true
        });
      },
      fail: function (res) {
        that.setData({
          isNoNetError: false
        });
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
        that.setData({
          isLoading: false
        });
      }
    });
  },

  onLoad: function (options) {
    groupOrderId = options.id;
    this.loadData();
  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {
    this.loadData();
  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})