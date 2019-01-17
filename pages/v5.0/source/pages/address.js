var util = require('../utils/util.js')

Page({
  data:{
    "old_value": "",
    "provinces" : [
        {
          'region_id' : 0,
          "region_name" : '请选择省'
        }
     ],     
    "citys" : [{
      'region_id' : 0,
      "region_name" : '请选择市'
    }],
    "areas" : [{
        'region_id' : 0,
        "region_name" : '请选择区'
    }],
     "regions" : false,
     "address_select" : 0,
     "provinceValue" : '',
     "cityValue" : '',
     "areaValue" : '',
     "provinceIndex" : '',
     "cityIndex" : '',
     "areaIndex" : '',
     "adTypes" : ['家庭','公司'],
     "address_name" : ['HOME','WORK'],
     "adTypeIndex" : 0,
     "areasAnimation" : {},
     "citysAnimation" : {},
     "provincesAnimation" : {},
     'provinceTop' : "0em",
     'cityTop' : "0em",
     'areaTop'  : "0em",
     'provinceVal' : "0",
     'cityVal' : "0",
     'areaVal'  : "0",
     'modalHidden' : true,
     'address' :  {
       "receive_name" : '',
       "mobile" : '',
       "address" : ''
     },
     'receive_name_tip' : false,
     'mobile_tip' : false,
     'province_tip' : false,
     'city_tip' : false,
     'district_tip' : false,
     'adType_tip' : false,
     'adinfo_tip' : false
  },
  formId:function(options){
  },
  deletes:function(options){
    var self = this;
    wx.showModal({
      title: '确定删除这个地址吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
           self.modalConfirm();
        } 
      }
    })
  },
  areaPickerChange:function (e) {
    var province_index = e.detail.value[0];
    var city_index = e.detail.value[1];
    var district_index = e.detail.value[2];

    if (e.detail.value[0] != this.data.old_value[0]) {
      var citys = [{ "region_name": "选择城市" }];
      var areas = [{ "region_name": "选择地区" }];

      if (this.data.provinces[province_index].region_id != undefined) {
        var province_id = this.data.provinces[province_index].region_id;
        var city = this.regions_data[2];
        for (var ii = 0; ii < city.length; ii++) {
          if (province_id == city[ii].parent_id) {
            citys.push(city[ii]);
          }
        }
      }


      this.setData({ old_value: [province_index, 0, 0] });
      this.setData({ citys: citys, areas: areas });

      if (this.data.provinces[this.data.old_value[0]].region_id) {
        this.setData({ 'province_tip': false });
      } else {
      }
      return;
    }

    if (e.detail.value[1] != this.data.old_value[1]) {

      var areas = [{ "region_name": "选择地区" }];

      if (this.data.citys[city_index] != undefined) {
        var city_id = this.data.citys[city_index].region_id;
        var area = this.regions_data[3];
        for (var ii = 0; ii < area.length; ii++) {
          if (city_id == area[ii].parent_id) {
            areas.push(area[ii]);
          }
        }
      }

      this.setData({ old_value: [province_index, city_index, 0] });
      this.setData({ areas: areas });

      if (this.data.citys[this.data.old_value[1]].region_id) {
        this.setData({ 'city_tip': false });
      } else {
      }
      return;
    }

    if (e.detail.value[2] != this.data.old_value[2]) {
      this.setData({ old_value: [province_index, city_index, district_index] });
    }

    if (this.data.areas[this.data.old_value[2]].region_id) {
      this.setData({ 'district_tip': false });
    } else {
    }
  },
  modalConfirm:function(options){
    util.loadding(this,1);
    var url = this.baseApiUrl + "/Api/Weuser/address?address_id=" + this.options.address_id + "&token=" + this.token;
    var self = this;
     util.ajax({
        url : url,
        method : "DELETE",
        success : function(data){
            if(data.result == 'ok') {
               util.loadding(self);
               var url = "./addresses";
               if(self.options.goods_id != undefined) {
                   url = url + "?sell_type=" + self.options.sell_type + "&goods_id=" 
                        + self.options.goods_id + "&address_id=" + self.options.address_id;
               }
               
               wx.navigateBack();
            } else {
                self.error(data);
            }
        }
     });
    this.setData({modalHidden : true});
  },
  //错误处理函数
  error:function(data) {
    this.setData({page : {load : 1}});
    if(data['result'] == 'fail') {
       util.toast(this,data.error_info);
    }
  },
  modalCancel:function(options){
    this.setData({modalHidden : true});
  },
  receive_function:function(e){
    if(!e.detail.value.trim()) {
       this.setData({'receive_name_tip' : true});
    } else {
       this.setData({'receive_name_tip' : false});
    }
  },
  mobile_function:function(e){
      if(!e.detail.value.trim()) {
        this.setData({'mobile_tip' : true});
      } else {
        this.setData({'mobile_tip' : false});
      }

      if(!/^\d{11}$/.test(e.detail.value.trim())) {

        this.setData({'mobile_tip' : true});
      } else {
        this.setData({'mobile_tip' : false});
      }
  },
  adinfo_function:function(e){
    if(!e.detail.value.trim()) {
       this.setData({'adinfo_tip' : true});
    } else {
       this.setData({'adinfo_tip' : false});
    }
  },
  //添加地址 || 或者修改地址
  listenFormSubmit:function(e){
    
    var that = this;  
    var formData = e.detail.value;   

   
    if(!formData.receive_name.trim()) {
       this.setData({'receive_name_tip' : true});
    } else {
       this.setData({'receive_name_tip' : false});
    }

    
    if(!formData.mobile.trim()) {
  
       this.setData({'mobile_tip' : true});
    } else {
       this.setData({'mobile_tip' : false});
    }

    if(!/^\d{11}$/.test(formData.mobile.trim())) {

       this.setData({'mobile_tip' : true});
    } else {
      this.setData({'mobile_tip' : false});
    }

    if(!formData.address_name.trim()) {
  
       this.setData({'adType_tip' : true});
    } else {
      this.setData({'adType_tip' : false});
    }

    if(!formData.province.trim()) {
       this.setData({'province_tip' : true});
    } else {
      this.setData({'province_tip' : false});
    }

     if(!formData.city.trim() && !this.data.province_tip) {
       this.setData({'city_tip' : true});
    } else {
       this.setData({'city_tip' : false});
    }
    
    if(!formData.district.trim() && !this.data.city_tip && !this.data.province_tip) {
    
       this.setData({'district_tip' : true});
    } else {
       this.setData({'district_tip' : false});
    }

    if(!formData.address.trim()) {
       this.setData({'adinfo_tip' : true});
    } else {
       this.setData({'adinfo_tip' : false});
    }

    if(this.data.receive_name_tip || this.data.mobile_tip || this.data.province_tip || this.data.city_tip ||this.data.district_tip ||this.data.adType_tip ||this.data.adinfo_tip) {
      return false;
    }

    util.loadding(this,1);
    if(!this.options.address_id) {
      this.addAddress(formData);
    } else {
       this.editAddress(formData);
    }
  },
   bindHideKeyboard: function(e) {
      wx.hideKeyboard()
  },
  addAddress:function(formData) {
    var url = this.baseApiUrl + "/Api/Weuser/address?token=" + this.token;
     var self = this;
     util.ajax({
        url : url,
        data : formData,
        method : "POST",
        success : function(data){
            util.loaded(self);
            if(data.result == 'ok') {
               if(self.options.goods_id != undefined && self.options.sell_type != undefined) {
                  wx.setStorageSync('select_address_id',data.address_id);

                  var pages = getCurrentPages()    //获取加载的页面
                  if(pages[pages.length-2] != undefined && pages[pages.length-2].route == "pages/addresses") {
                    wx.navigateBack({delta : 2});
                    return; 
                  }

                  wx.navigateBack({delta : 1});
                  return ;
               }
               
               wx.navigateBack(); 
            } 
        }
     });
  },
  editAddress:function(formData){
     var url = this.baseApiUrl + "/Api/Weuser/address?address_id=" + this.options.address_id + "&token=" + this.token;
     var self = this;
     util.ajax({
        url : url,
        data : formData,
        method : "PUT",
        success : function(data){
            util.loaded(self);
            if(data.result == 'ok') {
               var url = "./addresses";
               if(self.options.goods_id != undefined && self.options.goods_id != "undefined" &&  self.options.sell_type != undefined &&  self.options.sell_type != "undefined") {
                  wx.setStorageSync('select_address_id',self.options.address_id);
                  wx.navigateBack({delta : 2});
                  return;
               }

               wx.navigateBack();
            }
        }
     });
  },
  onLoad:function(options){
    this.options = options;
    if(this.options.address_id) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '添加新地址'
      })
    }

    util.loadding(this);
  
    
    var self = this;
    this.token = wx.getStorageSync('token');
    this.baseApiUrl = util.config('baseApiUrl'); 
    
    var data_version = wx.getStorageSync('data_version');
    
    var url = this.baseApiUrl + "/Api/project/data_version?type=region_list"; 

    var regions = [];
    util.ajax({
      "url" :  url,
      "data" : {},
      success : function(data) {
        if(data.result == 'ok') {
            
            if(data.data_version.version != data_version) {
              self.regions();  
              wx.setStorageSync('data_version',data.data_version.version);
              regions = this.regions_data;
            } else {
              regions = wx.getStorageSync('regions');
              if (regions) {
                var provinces = [{ 'region_name': '选择省份' }];
                var citys = [{ "region_name": "选择城市" }];
                var areas = [{ "region_name": "选择地区" }];

                regions[1].map(function (province) {
                  provinces.push(province);
                });

                self.setData({ "provinces": provinces, "citys": citys, "areas": areas });
                self.regions_data = regions;
                self.editHtml(regions);
                 
              } else {
                  self.regions();  
                  regions = this.regions_data;
              }
            }
        }
      },
      error : function(res) {
        //console.log("网络错误");
      }
    });
  },
  editHtml:function(regions){
    var self = this;
    if(this.options.address_id) {
       util.loadding(this,1);
       var url = this.baseApiUrl + "/Api/Weuser/address?address_id=" + this.options.address_id + "&token=" + this.token;
       util.ajax({
          "url" :  url,
          "data" : {},
          success : function(data) {
             util.loaded(self);
             if(data.result == 'ok') {
               self.setData({ loaded: true });

               var adTypeIndex = 0;
               if (data.address.address_name == self.data.address_name[0]) {
                 adTypeIndex = 0
               } else if (data.address.address_name == self.data.address_name[1]) {
                 adTypeIndex = 1;
               }
              
               var provinceId = data.address.province_id;
               var provinceVal = 0;
               var cityId = data.address.city_id;
               var cityVal = 0;
               var areaVal = 0;
               var areaId = data.address.district_id;

               var provinces = [{ 'region_name': '选择省份' }];;
               regions[1].map(function (province) {
                 provinces.push(province);
               });
               var citys = [{ "region_name": "选择城市" }];
               var city = regions[2];
               for (var ii = 0; ii < city.length; ii++) {
                 if (provinceId == city[ii].parent_id) {
                   citys.push(city[ii]);
                 }
               }


               var areas = [{ "region_name": "选择地区" }];

               var area = regions[3];
               for (var iii = 0; iii < area.length; iii++) {
                 if (cityId == area[iii].parent_id) {
                   areas.push(area[iii]);
                 }
               }


               for (var ii = 0; ii < citys.length; ii++) {
                 if (cityId == citys[ii].region_id) {
                   cityVal = ii;
                   var cityValue = citys[ii].region_name;
                   break;
                 }
               }

               for (var iiii = 0; iiii < areas.length; iiii++) {
                 if (areaId == areas[iiii].region_id) {
                   areaVal = iiii;
                   var areaValue = areas[iiii].region_name;
                   break;
                 }
               }

               for (var ii = 0; ii < provinces.length; ii++) {
                 if (provinceId == provinces[ii].region_id) {
                   provinceVal = ii;
                   var provinceValue = provinces[ii].region_name;
                   break;
                 }
               }

               self.setData({ "citys": citys, "areas": areas, "address": data.address });
               self.setData({ "old_value": [provinceVal, cityVal, areaVal] });
                
               self.setData({ loaded: true, 'adTypeIndex': adTypeIndex});
                
             }
          },
          error : function(res) {
            //console.log("网络错误");
          }
        });
    } else {
      //根据系统定位,获取默认地址
      var userMap = wx.getStorageSync("userMap");
      if(userMap != undefined && userMap) {
        var url = this.baseApiUrl + "/Api/Weuser/regions?token=" + this.token;
        util.ajax({
        url : url,
        data : userMap,
        method : "POST",
        success : function(data){
            if(data.result == 'ok') {
              self.byRegionsId(regions,data.region.province_id,data.region.city_id,data.region.district_id);  
            }
        }})};
      this.setData({loaded:true});
    }


  },
  //添加地址根据地区id定位城市
  byRegionsId: function(regions,provinceId,cityId,areaId) {
    var self = this;
    //var provinceId = data.address.province_id;
    var provinces = regions[1];
    var provinceVal = 0;

    //var cityId = data.address.city_id;
    //var citys = regions[2];
    var cityVal = 0;

    var areaVal = 0;
    
    //var areaId = data.address.district_id;
    
    //start重置省份
    var province = regions[1];

      //console.log('value ： ' + val);
      //id = data.address.province_id;

      var citys = [];
      var city = regions[2];
      for(var ii = 0;ii < city.length;ii++) {
          if(provinceId == city[ii].parent_id) {
            citys.push(city[ii]);
          }
      }


      var areas = [];

      var area = regions[3];
      for(var iii = 0;iii < area.length;iii++) {
        if(cityId == area[iii].parent_id) {
          areas.push(area[iii]);
        }
      }

    
    for(var ii = 0;ii < citys.length;ii++) {
        if(cityId == citys[ii].region_id) {
          cityVal = ii;
          var cityValue = citys[ii].region_name;
          break;
        }
    }

    for(var iiii = 0 ; iiii < areas.length; iiii++) {
      if(areaId == areas[iiii].region_id) {
        areaVal = iiii;
        var areaValue = areas[iiii].region_name;
        break;
      }
    }
  
    for(var ii = 0;ii < provinces.length;ii++) {
        if(provinceId == provinces[ii].region_id) {
            provinceVal = ii;
            var provinceValue = provinces[ii].region_name;
            break;
        }
    }


    self.setData({
      citys : citys,
      areas : areas,
      'provinceVal' : provinceVal,
      'cityVal' : cityVal,
      'areaVal'  : areaVal,
      "provinceIndex" : provinceId,
      "cityIndex" : cityId,
      "areaIndex" : areaId,
      "provinceValue" : provinceValue,
      "cityValue" : cityValue,
      "areaValue" : areaValue
    });

    self.init();

    self.setData({
      "provinceTop" : -2.5 * provinceVal + "em",
      'cityTop' : -2.5 * cityVal  + "em",
      'areaTop'  : -2.5 * areaVal  + "em"
    });
  }
  ,
  init: function() {
    //this.data.cityValue;
    //this.data.provinceValue;
    //this.data.areaValue;
    //var pos = target["pos_" + target.id];
    //var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
    var provinceTop = parseFloat(this.data.provinceTop.replace(/em/g, ""));
    var cityTop = parseFloat(this.data.cityTop.replace(/em/g, ""));
    var areaTop = parseFloat(this.data.areaTop.replace(/em/g, ""));

    //坐标
    var provincePos = provinceTop;
    var cityPos = cityTop;
    var areaPos = areaTop;

    for(var i = 0;i < parseInt(this.data.provinceVal); i++) {
        provincePos = provincePos - 2.5;
    }

    for(var i = 0;i < parseInt(this.data.cityVal); i++) {
        cityPos = cityPos - 2.5;
    }

    for(var i = 0;i < parseInt(this.data.areaVal); i++) {
        areaPos = areaPos - 2.5;
    }

    this.animationObj1.translate3d(0,provincePos + "em",0).step({duration: 80});
    this.setData({
      animationProvinces : this.animationObj1.export(),
    }); 

    this.animationObj2.translate3d(0,cityPos + "em",0).step({duration: 80});
    this.setData({
      animationCitys : this.animationObj2.export(),
    });

    this.animationObj3.translate3d(0,areaPos + "em",0).step({duration: 80});
    this.setData({
        animationAreas : this.animationObj3.export(),
     })
  },
  regions: function(e) {
    util.loadding(this);
    var self = this;
    var url = this.baseApiUrl + "/Api/project/regions";
    util.ajax({
      "url" :  url,
      "data" : {},
      success : function(data) {
        if(data.result == 'ok') {
            util.loaded(self);
            var regions = data.regions;
            if (regions) {

              var provinces = [{ 'region_name': '选择省份' }];
              var citys = [{ "region_name": "选择城市" }];
              var areas = [{ "region_name": "选择地区" }];

              regions[1].map(function (province) {
                provinces.push(province);
              });

              self.setData({ "provinces": provinces, "citys": citys, "areas": areas });
              self.regions_data = regions;
              self.editHtml(regions);
            }
            wx.setStorageSync('regions',regions);
        }
      },
      error : function(res) {
      }
    });
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  tapName:function(e){
  },
  onReady:function(){
  },
  onShow:function(){
	this.setData({page : {"load" : 1}});
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

    this.animationObj1 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    
    this.animationObj2 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    this.animationObj3 = wx.createAnimation({
      duration: 80,
      timingFunction: 'ease',
    })
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  address_select: function(e) {
     this.setData({
      address_select: 1
    })
  },
  provinces : function(e){
    var id = e.currentTarget.dataset.id;
    var citys = [];

     var city = this.regions_data[2];
     for(var ii = 0;ii < city.length;ii++) {
        if(id == city[ii][2]) {
          citys.push(city[ii]);
        }
     }
     this.setData({
        'citys' : citys
     });
  },
  citys : function(e){
    var id = e.currentTarget.dataset.id;
    var areas = [];

    var area = this.regions_data[3];
    for(var iii = 0;iii < area.length;iii++) {
      if(id == area[iii][2]) {
        areas.push(area[iii]);
      }
    }
    this.setData({
        'areas' : areas
     });
  },
  areas : function(e){
     var id = e.currentTarget.dataset.id;
     this.setData({
        "areaIndex" : id
     });
  },
  
  adTypesChange: function(e) {
    var adTypeIndex = e.detail.value; 
    this.setData({
      adTypeIndex: adTypeIndex
    })
  },

  finish: function(e) {
    this.setData({ 'toast_style': " " });
    if (!this.data.old_value[0]) {
      this.setData({"province_tip":true});
      return false;
    } else {
      if (this.province_tip)
        this.setData({ "province_tip": false });
    }

    if (!this.data.old_value[1]) {
      this.setData({"city_tip":true});
      return false;
    } else {
      if (this.city_tip) this.setData({ "city_tip": false });
    }
    if (!this.data.old_value[2]) {
      this.setData({"district_tip":true});
      return false;
    } else {
      if (this.district_tip) this.setData({ "district_tip": false });
    }
    this.setData({ "address_select": 0 });
  },
  close: function(e) {
    this.setData({
      "address_select" : 0
    });
  }
})