Page({
  data: {
    trees: ['香樟', '银杏', '梧桐', '松树'],
    selectedTree: '',
    wordCount: 0,
    tags: [
      '周边环境', '整株树形', '根茎', '树叶', 
      '花（含孢子）', '果（含种子）', '树栖动物', 
      '树生植物', '病虫害', '特殊性状', '人文资料', '其它'
    ],
    selectedTags: [],
    images: [],
    syncToHomework: false
  },

  bindTreeChange(e) {
    this.setData({
      selectedTree: this.data.trees[e.detail.value]
    });
  },

  bindTextAreaInput(e) {
    this.setData({
      wordCount: e.detail.value.length
    });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const index = this.data.selectedTags.indexOf(tag);
    if (index > -1) {
      this.data.selectedTags.splice(index, 1);
    } else {
      if (this.data.selectedTags.length >= 9) {
        wx.showToast({ title: '最多选择9个标签', icon: 'none' });
        return;
      }
      this.data.selectedTags.push(tag);
    }
    this.setData({ selectedTags: this.data.selectedTags });
  },

  chooseImage() {
    wx.chooseImage({
      count: 9 - this.data.images.length,
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        });
      }
    });
  },

  previewImage(e) {
    wx.previewImage({
      current: this.data.images[e.currentTarget.dataset.index],
      urls: this.data.images
    });
  },

  toggleSync() {
    this.setData({ syncToHomework: !this.data.syncToHomework });
  },

  handlePublish() {
    // 处理发布逻辑
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
  }
});