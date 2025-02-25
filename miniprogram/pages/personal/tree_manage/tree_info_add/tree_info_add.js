// pages/personal/tree_manage/tree_info_add/tree_info_add.js
// Page.js
Page({
  data: {
    selectedIcon: '/image/radio-selected.png', // 选中图标路径
    unselectedIcon: '/image/radio-normal.png', // 未选中图标路径
    radioListSoilType: [
      { value: 'loam', label: '壤土', checked: false },
      { value: 'sand', label: '砂土', checked: false },
      { value: 'clay', label: '粘土', checked: false },
      { value: 'unknow', label: '未知', checked: false }
    ],
    radioListSunlight: [
      { value: 'full', label: '全日照', checked: false },
      { value: 'morning', label: '上午日照', checked: false },
      { value: 'afternoon', label: '下午日照', checked: false },
      { value: 'none', label: '全阴', checked: false }
    ]

  },

  // 单选切换事件
  radioChange(e) {
    const value = e.detail.value;
    const radioListSunlight = this.data.radioListSunlight.map(item => ({
      ...item,
      checked: item.value === value
    }));
    this.setData({radioListSunlight});
  },

  radioChange2(e) {
    const value = e.detail.value;
    const radioListSoilType = this.data.radioListSoilType.map(item => ({
      ...item,
      checked: item.value === value
    }));
    this.setData({radioListSoilType});
  }
});