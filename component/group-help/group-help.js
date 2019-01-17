// component/group-help/group-help.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isGroupHelp: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    close_group_desc: function() {
      this.setData({ isGroupHelp: false});
    }
  }
})
