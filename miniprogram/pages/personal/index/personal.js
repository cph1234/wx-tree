const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    userInfo:{},
    avatar: '',
    nickname: '',
    newLetterNumber: 0,
    serviceId: '',
    param: app.globalData.param,
    inputValue:40,
    isDisabled:true
  },
  onLoad: function () {
    console.log(app.globalData)
    let user_openid = app.globalData.user_openid
    db.collection("userInfo").where({
      _openid:user_openid
    }).get().then(res=>{
      this.setData({
        userInfo : res.data[0],
        inputContent:res.data[0].name
      })
      const width = res.data[0].name.length * 36; // 假设每个字符宽度为 36rpx
      console.log(width)
      this.setData({
        inputWidth: width
      });
    })
    
    // let userStorage = wx.getStorageSync('user');
    // if (userStorage) {
    //   this.setData({
    //     user: userStorage
    //   })
    // }
    // var avatar = ''
    // var nickname = ''

    // if (app.globalData.userInfo) {
    //   avatar = app.globalData.userInfo.avatarUrl,
    //   nickname = app.globalData.userInfo.nickName
    // }
    // this.setData({
    //   param: app.globalData.param,
    //   avatar: avatar,
    //   nickname: nickname,
    // })
  },
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    let info = this.data.userInfo
    info.avatar_url = avatarUrl
    this.setData({
      userInfo:info
    })
    wx.cloud.uploadFile({
      cloudPath: 'avatar/' + app.globalData.user_openid + '.png', // 云存储路径
      filePath: avatarUrl, // 本地文件路径
      success: function (res) {
        console.log('上传成功', res.fileID);
        let user_openid = app.globalData.user_openid
        db.collection("userInfo").where({
          _openid:user_openid
        }).update({
          data:{
            avatar_url:res.fileID
          }
        })
      },
      fail: function (err) {
        console.error('上传失败', err);
      }
    });
    
    app.globalData.userInfo.avatarUrl = avatarUrl
  },
  onInput(e) {
    const value = e.detail.value;
    console.log(value)
    // 模拟计算输入内容的宽度，实际中可根据字体大小等精确计算
    this.setData({
      inputContent: value,
      inputWidth: value.length * 36
    });
  },
  enableInput(){
    this.setData({
      isDisabled: false,
    });
  },
  onInputBlur(e){
    setTimeout(() => {
      console.log(this.data.inputContent)
      db.collection("userInfo").where({
        _openid:app.globalData.user_openid
      }).update({
        data:{
          name:this.data.inputContent
        }
      })
    }, 1000);
  },
  onShow: function () {
    
  },
  onReady: function () {
  },
  /**
   * 进入消息列表
   */
  openMessage: function () {
    wx.navigateTo({
      url: '/pages/personal/message/message?type=0&new_message=0'
    })
  },

  /**
   * 进入话题列表
   */
  opendTopicList: function () {
    wx.navigateTo({
      url: '/pages/personal/topic_list/topic_list'
    })
  },
  /**
   * 进入表白墙列表
   */
  opendPostList: function () {
    wx.navigateTo({
      url: '/pages/personal/post_list/post_list'
    })
  },
  /**
   * 进入卖舍友列表
   */
  openSaleList: function () {
    wx.navigateTo({
      url: '/pages/personal/sale_list/sale_list'
    })
  },
})