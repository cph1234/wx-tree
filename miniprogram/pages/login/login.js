// login.js
const app = getApp()
Page({
  data: {
    selectedRole: null,
    userInfo: null,
    selectedIcon: '/image/radio-selected.png', // 选中图标路径
    unselectedIcon: '/image/radio-normal.png', // 未选中图标路径
    radioListUser: [
      { value: 'obeserver', label: '观察者', checked: true },
      { value: 'teamleader', label: '组长', checked: false }
    ]
  },
  login() {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: res => {
        console.log(res.userInfo)
        var user = res.userInfo
        //设置全局用户信息
        app.globalData.userInfo = user
        //设置局部用户信息
        this.setData({
          userInfo: user
        })
        wx.showLoading({
            title: '登录中...',
        });
        //检查之前是否已经授权登录
        wx.cloud.database().collection('userInfo').where({
          open_id: app.globalData.user_openid
        }).get({
          success: res => {
            console.log(res.data.length)
            //原先没有添加，这里添加
            if (res.data.length==0) {
              //将数据添加到数据库
              wx.cloud.database().collection('userInfo').add({
                data: {
                  avatar_url: user.avatarUrl,
                  name: user.nickName,
                  open_id: app.globalData.user_openid,
                  my_attention:[],
                  my_fans:[],
                  my_team_member:[],
                  my_likes:[],
                  current_likes:[],
                  current_comments:[],
                  current_fans:[],
                  medal_count:0
                },
                success: res => {
                  wx.showToast({
                    title: '登录成功',
                    icon: 'none'
                  })
                  wx.hideLoading()
                  wx.switchTab({
                      url: '/pages/home/index/index'
                  })
                }
              })
            } else {
              //已经添加过了
              wx.showToast({
                title: '登录成功',
                icon: 'none'
              })
              // wx.setStorageSync('openid', res.result.openid)
              wx.hideLoading()
              wx.switchTab({
                  url: '/pages/home/index/index'
              })
            }
          }
        })
      }
    })
  },
  selectRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role });
  },

  radioChange(e) {
    const value = e.detail.value;
    const radioListUser = this.data.radioListUser.map(item => ({
      ...item,
      checked: item.value === value
    }));
    this.setData({radioListUser});
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