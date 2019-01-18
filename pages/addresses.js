// pages/addresses.js
//获取应用实例
const app = getApp();

var goodsId = 0, addressId = 0, sellType = 0;
Page({

 
  data: {
    isLoading: true,
    isOperate: false,
    showAuthModal: false
  },

  loadData: function () {
    var that = this;

    app.getUserInfo(function (res) {

    }, function () {
      that.setData({
        showAuthModal: true,
      });
    });
    
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/addresses',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success: function (res) {

        that.setData({
          addressList: res.data.address_list
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
  
  onPullDownRefresh: function () {
    this.loadData();
  },

  onLoad: function (options) {
    goodsId = options.goods_id,
    sellType = options.sell_type,
    addressId = options.address_id;
    this.loadData();
  },

  edit: function (e) {
    wx.navigateTo({
      "url": "address?address_id=" + e.target.dataset.address_id + "&goods_id=" + goodsId + "&sell_type=" + sellType,
    });
  },

  onReady: function () {

  },

  
  onShow: function () {

  },

 
  onHide: function () {

  },

 
  onUnload: function () {

  },
 
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})