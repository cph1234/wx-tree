// login.js
const app = getApp()
Page({
  data: {
    selectedRole: null,
    userInfo: null
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
                  my_likes:[]
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