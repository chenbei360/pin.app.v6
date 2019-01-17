// pages/address.js
//获取应用实例
const app = getApp(), addressEnglishNames = ['HOME', 'WORK'],addressChinaNames = ['家庭', '公司'];
var addressId = 0, dataVersion = wx.getStorageSync('data_version'), serveDataVersion, regions = wx.getStorageSync('regions');


Page({
  data: {
    isLoading: true,
    isOperate: false,
    adTypes: addressChinaNames,
    adTypeIdx: 0,
    showAuthModal: false
  },

  // 数据版本
  loadDataVersion: function (successCallback, failCallback) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/project/data_version?type=region_list',
      success: function (res) {
        serveDataVersion = res.data.data_version.version;
        successCallback();
      },
      fail: function (res) {
        failCallback();
      },
      complete: function (res) {
      }
    });
  },

  laodRegions: function (successCallback, failCallback) {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/project/regions',
      success: function (res) {
        regions = res.data.regions;
        successCallback();
      },
      fail: function (res) {
        failCallback();
      },
      complete: function (res) {
      }
    });
  },

  loadAddress: function (successCallback, failCallback) {
    
  },

  
  loadData: function() {
    var that = this;

    app.getUserInfo(function (res) {
      
    }, function () {
      that.setData({
        showAuthModal: true,
      });
    });
    
    that.loadDataVersion(function(){

      if (dataVersion != serveDataVersion){
        that.laodRegions(function(){
          wx.setStorageSync('data_version', serveDataVersion),
          wx.setStorageSync('regions', regions);
        },function(){});
      }

      var provinces = regions[1];
      var citys = [{ "region_name": "选择城市" }];
      var areas = [{ "region_name": "选择地区" }];

      provinces.unshift({ 'region_name': '选择省份' });

      that.setData({ provinces: provinces, citys: citys, areas: areas});


      if(addressId){

      }else{
        that.setData({isLoading:false});
      }

    },function(){});
  },
  
  onLoad: function (options) {
    addressId = this.options.address_id;
    wx.setNavigationBarTitle({
      title: addressId ? '编辑地址' : '添加新地址' 
    })

    this.loadData();
  },
  

  openRegion: function (e) {
    this.setData({
      isRegionOpen: true
    })
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