// pages/groups.js
//获取应用实例
const app = getApp();

Page({

  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    groups: [],
    isHideLoadMore: true,
    isNoNetError: true
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.orders = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/groups',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { offset: that.data.orders.length, size: 30 },
      success: function (res) {
        that.setData({
          groups: res.data.group_orders
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

  toDetail: function (e) {
    var url = e.currentTarget.dataset.url + "?id=" + e.currentTarget.dataset.id;
    wx.navigateTo({
      url: url
    });
  },
  
  onLoad: function (options) {
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

  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})