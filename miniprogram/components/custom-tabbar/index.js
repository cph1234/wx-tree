// components/custom-tabbar/index.js
Component({
  data: {
    activeIndex: 1,
    list: [] // 从 app.json 的 tabBar.list 同步
  },
  
  methods: {
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset;
      if (this.data.activeIndex === index) return;
      this.setData({ activeIndex: index });
      wx.switchTab({ url: `/${path}` });
    },
    updateActive(path) {
      const index = this.data.list.findIndex(item => path.includes(item.pagePath));
      if (index !== -1) this.setData({ activeIndex: index });
    }
  },
  attached() {
      // 从 app.json 获取 tabBar.list 配置
      const app = getApp();
      this.setData({ list: app.globalData.tabBarList });
      // 初始化选中状态
      const pages = getCurrentPages();
      this.updateActive(pages[pages.length - 1].route);
    }
});