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
    goodsId = options.goods_id || false,
    sellType = options.sell_type || false,
    addressId = options.address_id || false;

    this.setData({
      goods_id: goodsId,
      address_id: addressId,
      sell_type: sellType,
      address_id: addressId
    }),
    this.loadData();
  },
  setDefaults: function (obj) {
    var idx = obj.currentTarget.dataset.index, that = this , url;

    

    if (goodsId && goodsId != "undefined" && sellType && sellType != "undefined"){

      url = "./checkout?goods_id=" + goodsId + "&sell_type=" + sellType
      
      if (that.data.addressList[idx].address_id){
        url += "&address_id=" + that.data.addressList[idx].address_id
      }

      wx.redirectTo({
        url: url,
      })

      return;
    }

    wx.request({
      url: app.globalData.apiUrl + "v1.0/users/addresses/" + that.data.addressList[idx].address_id,
      method: "PUT",
      data: {status : "DEFAULT"},
      header: {
        'AccessToken': wx.getStorageSync("token")
      }
    });



    for (var i = 0; i < that.data.addressList.length; i++){
      that.data.addressList[i].status = (i == idx ? "DEFAULT" : "COMMON");
    }
    that.setData({ addressList: that.data.addressList });


  },
  edit: function (e) {
    var url = "address?address_id=" + e.target.dataset.address_id;
    if (goodsId && sellType){
      url += "&goods_id=" + goodsId + "&sell_type=" + sellType;
    }
    wx.redirectTo({
      "url": url,
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

  }
})