// login.js
Page({
  data: {
    selectedRole: null
  },

  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role });
  },

  getPhoneNumber(e) {
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      // 处理获取手机号逻辑
      console.log('encryptedData:', e.detail.encryptedData);
      console.log('iv:', e.detail.iv);
      // 这里需要将加密数据传给后端解密
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  }
});