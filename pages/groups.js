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
    isNoNetError: true,
    _: app.globalData._.config
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.groups = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/groups',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { offset: that.data.groups.length, size: 30 },
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

  loadMore: function() {
    var that = this;
    that.setData({
      isHideLoadMore: false
    });

    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/groups',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { offset: that.data.groups.length, size: 15 },
      success: function (res) {
        that.setData({
          groups: that.data.group_orders.concat(res.data.group_orders)
        });
      },
      fail: function (res) {
      },
      complete: function (res) {
        that.setData({
          isHideLoadMore: true
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
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isHideLoadMore) {
      this.loadMore();
    }
  },

  onReachBottom: function () {

  },
  
  onTabItemTap: function (item) {
    wx.startPullDownRefresh();
  }
})