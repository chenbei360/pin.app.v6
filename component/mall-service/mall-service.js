// component/g-h-service/g-h-service.js
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
    "service" : [
      { "type": "全场包邮", "desc": "所有商品均无条件包邮" },
      { "type": "7天退换", "desc": "满足相应条件时，消费者可申请7天无理由退换货" },
      { "type": "48小时发货", "desc": "若超时未发货，消费者将会收到至少3元无门槛代金券" }
    ]
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
