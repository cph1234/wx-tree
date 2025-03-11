// components/custom-tabbar/index.js
Component({
  data: {
    currentIndex: 0 // 默认选中第一个 Tab
  },

  methods: {
    switchTab(e) {
      const index = parseInt(e.currentTarget.dataset.index)
      this.setData({ currentIndex: index })
      // 这里可以添加页面切换逻辑，例如：
      const pages = ['/miniprogram/pages/home/index/index', '/miniprogram/pages/home/post_tree/post', '/miniprogram/pages/personal/index/personal']
      wx.switchTab({
        url: pages[index]
      })
    }
  }
})