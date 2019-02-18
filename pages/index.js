// pages/index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    isLoading: true,
    isOperate: false,
    banner: [],
    goods: [],
    isHideLoadMore: true,
    isNoNetError: true,
  },
  bannerList: function () {
    var that = this;
    //请求广告列表
    that.data.banner = [];
    
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/banners',
      success: function (res) {
        that.setData({
          banner: res.data.banners
        });
      },
      fail: function (res) {
        that.setData({
          isNoNetError: false
        });
      }
    });
  },
  goodsList: function() {
    var that = this;
    //请求商品列表
    that.data.goods = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/goods',
      data: { offset: that.data.goods.length,size: 30},
      success: function (res) {
        that.setData({
          goods: res.data.goods
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
  
  loadData: function() {
    var that = this;
    this.bannerList(),this.goodsList();
  },
  
  onPullDownRefresh: function() {
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
  
  loadMore: function () {
    var that = this;
    that.setData({
      isHideLoadMore: false
    });
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/goods',
      data: { offset: that.data.goods.length, size: 15 },
      success: function (res) {
        that.setData({
          goods: that.data.goods.concat(res.data.goods)
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
  
  onLoad: function (options) {
    this.loadData();
  },

  onTabItemTap: function (item) {
    wx.startPullDownRefresh();
  },
  onShareAppMessage: function () { 
    return app.share({ title: "", desc: "", path: "" }); 
  },
  bannerClick: function (e) {
    var bannerType = e.currentTarget.dataset.banner_type,targetUrl = e.currentTarget.dataset.target_url;

    switch (bannerType) {
      case "1":
        wx.navigateTo({
          url: targetUrl,
        });
        break;

      case "2":
        wx.navigateTo({
          url: './webview?url=' + targetUrl,
        });
        break;

      default:
        break;
    }

  }
  
})