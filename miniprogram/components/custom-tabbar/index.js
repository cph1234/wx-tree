// components/custom-tabbar/index.js
Component({
  properties: {
    activeIndex: {
      type: Number,
      value: 1 // 默认选中中间项
    }
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('tabchange', { index })
      // 实际使用中需要配合页面跳转
      const pages = ['/pages/community/community', '/pages/observation/observation', '/pages/profile/profile']
      wx.switchTab({
        url: pages[index]
      })
    }
  }
})