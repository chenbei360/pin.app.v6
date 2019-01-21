const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    service: app.globalData._.config.mall_service
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close_service_detail: function() {
      var that = this;

      that.setData({ "service_detail_show": false });
      setTimeout(function () {
        that.setData({ "service_detail": false });
      }, 300)
    },
    open_service_detail: function () {
      var that = this;
      
      that.setData({ "service_detail": true });
      setTimeout(function () {
        that.setData({ "service_detail_show": true });
      }, 150)
    }
  }
})
