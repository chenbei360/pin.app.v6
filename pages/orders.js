// pages/orders.js
//获取应用实例
const app = getApp();
var orderType = 0, 
    orderId = 0, 
    order = require('../utils/order.js')

Page({

  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    orders: [],
    isHideLoadMore: true,
    isNoNetError: true
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.orders = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/orders',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { offset: that.data.orders.length, size: 30 },
      success: function (res) {
        that.setData({
          orders: res.data.order_list
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
      url: app.globalData.apiUrl + 'v1.0/users/orders',
      data: { offset: that.data.orders.length, size: 15 },
      success: function (res) {
        that.setData({
          orders: that.data.orders.concat(res.data.order_list)
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

  orderCancel: function(e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;
    order.cancel(orderId, function (res) {
      if (res.data.result == 'ok') {
        wx.startPullDownRefresh();
      }
    }, function (res) {
    });
  },
  
  orderBuy: function(e) {
    orderId = e.currentTarget.dataset.order_id,
    order.pay(orderId,function(res) {


      if(res.data.result == 'ok'){
        order.goPay(res.data.param,function(){
          wx.redirectTo({
            url: "./order?id=" + orderId
          })
        },function(){},function(){
          
        });
      }
      
    },function() {

    },function() {
      
    });
  },

  // onTabItemTap: function (item) {
  //   this.setData({isLoading:true}),
  //   wx.startPullDownRefresh();
  // },

  
  onReady: function () {

  },

  
  onShow: function () {
    //wx.startPullDownRefresh();
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