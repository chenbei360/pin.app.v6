// pages/checkout.js
//获取应用实例
const app = getApp();
var sellType = 0, goodsId = 0, addressId = 0, groupOrderId = 0, orderId = 0,
    order = require('../utils/order.js')

Page({

  data: {
    isLoading: true,
    isBannering: true,
    isGroupHelp: false,
    isNoNetError: true,
    isPayDisable: false,
    isCancelPay: false
  },
  
  loadAddresses: function (successCallback, failCallback) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/addresses',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success: function (res) {
        successCallback(res);
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    });
  },

  setIsGroupHelp: function() {
    this.setData({"isGroupHelp" : true});
  },
  
  goodsDetail: function() {
    var that = this;
    wx.request({
      url: app.globalData.miniUrl + 'v1.0/goods/' + goodsId,
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

  orderBanner: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/banners/order',
      success: function (res) {
        that.setData({
          banner: res.data.banner
        });
      }
    });
  },

  closeBanner: function (e) {
    this.setData({ 'isBannering': false });
  },

  loadData: function() {
    var that = this;
    
    this.goodsDetail(),
    
    this.orderBanner(),

    this.loadAddresses(function(res){
      if (res.data['result'] == "ok") {
        if (res.data.address_list.length > 0){


          var address = that.addressSort(res.data.address_list, addressId); 
          that.setData({ "address": address }), addressId = address.address_id;
        }
      }
    },function(){});


  },

  //跳转地址页面
  redirectAddresses: function () {

    if(orderId){
      wx.showToast({ title: "订单已生成，信息不可更改", icon: "none" });
      return;
    }

    var url;


    if (this.data.address != undefined && this.data.address.address_id != undefined && this.data.address.address_id > 0) {
      url = "addresses?sell_type=" + sellType + "&goods_id=" + goodsId;
      url += "&address_id=" + this.data.address.address_id;
    } else {
      url = "address?goods_id=" + goodsId + "&sell_type=" + sellType;
    }


    wx.navigateTo({
      url: url
    });
  },

  onLoad: function (options) {
    var that = this;
    goodsId = options.goods_id,
    sellType = options.sell_type, 
    addressId = options.address_id,
    groupOrderId = options.group_order_id,
    orderId = 0;

    this.setData({
      sell_type: sellType,
      goods_id: goodsId
    });

    setTimeout(function () {
      that.closeBanner();
    }, 3500);

    this.loadData();
  },


  btnOrderDone: function () {
    if (!this.data.address) return false;
    if (this.data.isPayDisable) return true;

    var that = this, createOrderData;
    this.setData({ "isPayDisable": true });


    if (orderId){
      that.pay();
      return;
    }



    createOrderData = {
      "goods_id": goodsId,
      "address_id": addressId,
      "groupbuy": sellType == 1 ? 1 : 0,
      "group_order_id": groupOrderId ? groupOrderId : 0
    };    
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/orders',
      method: "POST",
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: createOrderData,
      success: function (res){
        if(res.data.result == "ok"){
          orderId = res.data.order_id,
          that.pay();
        }else{
          that.setData({ "isPayDisable": false });
        }
      },
      fail: function (res) {
        that.setData({"isPayDisable": false});
      },
      complete: function (res) {
      }
    });

  },

  // 请求支付参数
  pay: function (e) {
    var that = this;
    order.pay(orderId,function(res){  

      if (res.data.result == 'ok') {
        order.goPay(res.data.param, function () { }, function () { }, function (res) {
          if (res.errMsg == "requestPayment:fail cancel") {
            that.setData({ "isCancelPay": true }),
              wx.showToast({ title: "支付未完成， 请重新支付", icon: "none" });
          }
          that.setData({ "isPayDisable": false })
        });
      }

    },function(res){
      that.setData({ "isPayDisable": false })
    },function(res){
      
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

  onPullDownRefresh: function () {

  },


  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },


  addressSort: function (list, address_id) {
    var address;
    if (list.length == 1) {
      return list[0];
    }
    if (list.length <= 0) {
      return null;
    }

    for (var i in list) {
      if (undefined != address_id) {
        if (list[i]['address_id'] == address_id) {
          address = list[i];
        }
      } else if (list[i]['status'] == "DEFAULT") {
        address = list[i];
      } else if (i >= list.length - 1) {
        address = list[0];
      }
    }
    return address;
  }
})