// pages/address.js
//获取应用实例
const app = getApp(), addressEnglishNames = ['HOME', 'WORK'],addressChinaNames = ['家庭', '公司'];
var addressId = 0, goodsId = 0, sellType = 0, dataVersion = wx.getStorageSync('data_version'), serveDataVersion, regions = wx.getStorageSync('regions');


Page({
  data: {
    old_value: "",
    isLoading: true,
    isOperate: false,
    adTypes: addressChinaNames,
    adTypeIdx: 0,
    showAuthModal: false,
    addressNames: addressEnglishNames
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
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + "v1.0/users/address/" + addressId,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success(res) {
        successCallback(res);
      },
      fail: function (res) {
        failCallback();
      },
      complete: function (res) {
        that.setData({ isLoading: false, isOperate: false });
      }
    });
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


        
          if (addressId){
            that.loadAddressEvent();
          } else {
            that.setData({ isLoading: false }),
            that.initProvince();
          }
          

        },function(){});
      }else{


        if (addressId) {
          that.loadAddressEvent();
        } else {
          that.setData({ isLoading: false }),
          that.initProvince();
        }


      }
    },function(){});
  },

  loadAddressEvent: function() {
    var that = this;
    that.loadAddress(function (res) {
      var adTypeIdx = 0;
      if (res.data.address.address_name == that.data.addressNames[0]) {
        adTypeIdx = 0
      } else if (res.data.address.address_name == that.data.addressNames[1]) {
        adTypeIdx = 1;
      }

      var provinceId = res.data.address.province_id,
        cityId = res.data.address.city_id,
        areaId = res.data.address.district_id,
        provinces = [{ 'region_name': '选择省份' }],
        citys = [{ "region_name": "选择城市" }],
        areas = [{ "region_name": "选择地区" }],
        area = regions[3],
        city = regions[2],
        provinceIdx, areaIdx, cityIdx;

      regions[1].map(function (province) {
        provinces.push(province);
      });


      for (var ii = 0; ii < city.length; ii++) {
        if (provinceId == city[ii].parent_id) {
          citys.push(city[ii]);
        }
      }
      for (var iii = 0; iii < area.length; iii++) {
        if (cityId == area[iii].parent_id) {
          areas.push(area[iii]);
        }
      }



      for (var ii = 0; ii < citys.length; ii++) {
        if (cityId == citys[ii].region_id) {
          cityIdx = ii;
          break;
        }
      }
      for (var iiii = 0; iiii < areas.length; iiii++) {
        if (areaId == areas[iiii].region_id) {
          areaIdx = iiii;
          break;
        }
      }
      for (var ii = 0; ii < provinces.length; ii++) {
        if (provinceId == provinces[ii].region_id) {
          provinceIdx = ii;
          break;
        }
      }

      that.setData({ provinces: provinces, citys: citys, areas: areas, address: res.data.address, old_value: [provinceIdx, areaIdx, cityIdx], adTypeIdx: adTypeIdx});



    }, function () {

    });
  },

  handlerAddress: function (addressData, url, method, successCallback, failCallback) {
    var that = this;

    this.setData({isLoading: true,isOperate: true});
    wx.request({
      url: url,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      method: method,
      data: addressData,
      success(res) {
        successCallback(res);
      },
      fail: function (res) {
        failCallback();
      },
      complete: function (res) {
        that.setData({isLoading: false,isOperate: false});
      }
    });
  },

  //添加地址 || 或者修改地址
  listenFormSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;


    if (!formData.receive_name.trim()) {
      this.setData({ 'receive_name_tip': true });
    } else {
      this.setData({ 'receive_name_tip': false });
    }


    if (!formData.mobile.trim()) {

      this.setData({ 'mobile_tip': true });
    } else {
      this.setData({ 'mobile_tip': false });
    }

    if (!/^\d{11}$/.test(formData.mobile.trim())) {

      this.setData({ 'mobile_tip': true });
    } else {
      this.setData({ 'mobile_tip': false });
    }

    if (!formData.address_name.trim()) {

      this.setData({ 'adType_tip': true });
    } else {
      this.setData({ 'adType_tip': false });
    }

    if (!formData.province.trim()) {
      this.setData({ 'province_tip': true });
    } else {
      this.setData({ 'province_tip': false });
    }

    if (!formData.city.trim() && !this.data.province_tip) {
      this.setData({ 'city_tip': true });
    } else {
      this.setData({ 'city_tip': false });
    }

    if (!formData.district.trim() && !this.data.city_tip && !this.data.province_tip) {

      this.setData({ 'district_tip': true });
    } else {
      this.setData({ 'district_tip': false });
    }

    if (!formData.address.trim()) {
      this.setData({ 'adinfo_tip': true });
    } else {
      this.setData({ 'adinfo_tip': false });
    }

    if (this.data.receive_name_tip || this.data.mobile_tip || this.data.province_tip || this.data.city_tip || this.data.district_tip || this.data.adType_tip || this.data.adinfo_tip) {
      return false;
    }

    var url = "./addresses", goOrder = goodsId && goodsId != "undefined" && sellType && sellType != "undefined";

    if (goOrder) 
    {
      url += "?goods_id=" + goodsId,
      url += "&sell_type=" + sellType; 
    }

    if (!addressId) {
      this.handlerAddress(formData, app.globalData.apiUrl + "v1.0/users/address","POST"
      ,function  (res){

        if (res.data.result == 'ok'){
          if (goOrder){
            url += "&address_id=" + res.data.address_id;
          }
        }

        wx.redirectTo({
          url: url,
        });

      },function(){

      });
    } else {
      this.handlerAddress(formData, app.globalData.apiUrl + "v1.0/users/address/" + addressId, "PUT"
      , function (res) {
        
        if (goOrder){
          url += "&address_id=" + addressId;
        }

        wx.redirectTo({
          url: url,
        });

      }, function () {

      });
    }
  },
  
  initProvince: function() {
    var provinces = [{ 'region_name': '选择省份' }];
    var citys = [{ "region_name": "选择城市" }];
    var areas = [{ "region_name": "选择地区" }];
    regions[1].map(function (province){
      provinces.push(province);
    });
    this.setData({ provinces: provinces, citys: citys, areas: areas });
  },

  areaPickerChange: function (e) {
    var province_idx = e.detail.value[0],
      city_idx = e.detail.value[1],
      district_idx = e.detail.value[2],
      citys = [],
      areas = [],
      province_id,
      city,
      area,
      city_id;

    // 省份
    if (e.detail.value[0] != this.data.old_value[0]) {
      citys = [{ "region_name": "选择城市" }],
      areas = [{ "region_name": "选择地区" }];
      if (this.data.provinces[province_idx].region_id != undefined) {
        province_id = this.data.provinces[province_idx].region_id,
        city = regions[2];
        for (var ii = 0; ii < city.length; ii++) {
          if (province_id == city[ii].parent_id) {
            citys.push(city[ii]);
          }
        }
      }
      
      this.setData({ old_value: [province_idx, 0, 0] });
      this.setData({ citys: citys, areas: areas });

      if (this.data.provinces[this.data.old_value[0]].region_id) {
        this.setData({ 'province_tip': false });
      } else {
      }
      return;
    }

    //城市
    if (e.detail.value[1] != this.data.old_value[1]) {

      areas = [{ "region_name": "选择地区" }];

      if (this.data.citys[city_idx] != undefined) {
        city_id = this.data.citys[city_idx].region_id,
        area = regions[3];
        for (var ii = 0; ii < area.length; ii++) {
          if (city_id == area[ii].parent_id) {
            areas.push(area[ii]);
          }
        }

        this.setData({ old_value: [province_idx, city_idx, 0] });
        this.setData({ areas: areas });

        if (this.data.citys[this.data.old_value[1]].region_id) {
          this.setData({ 'city_tip': false });
        } else {
        }
        return;
      }
    }

    if (e.detail.value[2] != this.data.old_value[2]) {
      this.setData({ old_value: [province_idx, city_idx, district_idx] });
    }

    if (this.data.areas[this.data.old_value[2]].region_id) {
      this.setData({ 'district_tip': false });
    } else {
    }

  },

  adTypesChange: function (e) {
    var adTypeIdx = e.detail.value;
    this.setData({
      adTypeIdx: adTypeIdx
    })
  },

  finish: function (e) {
    if (!this.data.old_value[0]) {
      this.setData({ "province_tip": true });
      return false;
    } else {
      if (this.province_tip)
        this.setData({ "province_tip": false });
    }

    if (!this.data.old_value[1]) {
      this.setData({ "city_tip": true });
      return false;
    } else {
      if (this.city_tip) this.setData({ "city_tip": false });
    }
    if (!this.data.old_value[2]) {
      this.setData({ "district_tip": true });
      return false;
    } else {
      if (this.district_tip) this.setData({ "district_tip": false });
    }
    this.closeRegion();
  },
  

  receive_function: function (e) {
    if (!e.detail.value.trim()) {
      this.setData({ 'receive_name_tip': true });
    } else {
      this.setData({ 'receive_name_tip': false });
    }
  },


  mobile_function: function (e) {
    if (!e.detail.value.trim()) {
      this.setData({ 'mobile_tip': true });
    } else {
      this.setData({ 'mobile_tip': false });
    }

    if (!/^\d{11}$/.test(e.detail.value.trim())) {

      this.setData({ 'mobile_tip': true });
    } else {
      this.setData({ 'mobile_tip': false });
    }
  },


  adinfo_function: function (e) {
    if (!e.detail.value.trim()) {
      this.setData({ 'adinfo_tip': true });
    } else {
      this.setData({ 'adinfo_tip': false });
    }
  },

  onLoad: function (options) {
    addressId = this.options.address_id,
    goodsId = this.options.goods_id,
    addressId = this.options.address_id,
    sellType = this.options.sell_type;

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

  closeRegion: function (e) {
    this.setData({
      isRegionOpen: false
    })
  },

  deleteAddressEvent: function(e) {
    var that = this,url = "./addresses", goOrder = goodsId && goodsId != "undefined" && sellType && sellType != "undefined";
    console.log(goodsId)
    that.cancelCallback = function () {
      that.setData({ showWinpopModal: true });
    },

    that.confirmCallback = function () {


      that.setData({ isLoading: true, isOperate: true });
      wx.request({
        url: app.globalData.apiUrl + "v1.0/users/address/" + addressId,
        method: "DELETE",
        header: {
          'AccessToken': wx.getStorageSync("token")
        },
        success(res) {
          if (res.data.result == 'ok') {

            if (goOrder) {
              url += "?sell_type=" + sellType + "&goods_id="
                + goodsId + "&address_id=" + addressId;
            }

            wx.redirectTo({
              url: url,
            });
          }
        },
        fail: function (res) {
        },
        complete: function (res) {
          that.setData({ isLoading: false, isOperate: false })
        }
      });

      
    },


    that.setData({ showWinpopModal: true, winpopContent: "确定删除这个地址吗？" })
    

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

  }
  
})