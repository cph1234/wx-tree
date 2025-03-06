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
    isDisabled:true,
    likes:0,
    ifTL:true,
    treeType:''
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
      db.collection("treeManage").where({
        teamLeader:res.data[0]._id
      }).get().then(res=>{
        if(res.data.length==0){
          this.setData({
            ifTL:false
          })
        }else{
          this.setData({
            ifTL:true,
            treeType:res.data[0].treeType
          })
        }
      })
      
      db.collection("userInfo")
      .where({my_attention:res.data[0]._id})
      .get().then(res=>{
        console.log(res)
        this.setData({
          likes:res.data.length
        })
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
  treeInfoManage(){
    wx.navigateTo({
      url: '/pages/personal/tree_manage/tree_manage?userId='+this.data.userInfo._id,
    })
  },
  observation(){
    wx.navigateTo({
      url: '/pages/personal/my_timeline/my_timeline?userId='+this.data.userInfo._id,
    })
  },
  homework(){
    wx.navigateTo({
      url: '/pages/personal/my_homework/my_homework?userId='+this.data.userInfo._id,
    })
  },
  customerService(){
    wx.navigateTo({
      url: '/pages/chat/chat?sendUserId='+this.data.userInfo._id+'&receiveUserId=b834edac67b4175902cbe76e210c0bab' // 目标页面路径，支持传递参数
    });
  },
  ranking(){
    wx.navigateTo({
      url: '/pages/personal/rank/rank?userId='+this.data.userInfo._id,
    })
  },
  out(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  my_group(){
    wx.navigateTo({
      url: '/pages/personal/my_group/my_group?userId='+this.data.userInfo._id,
    })
  },
  my_follow(){
    wx.navigateTo({
      url: '/pages/personal/my_follow/my_follow?userId='+this.data.userInfo._id,
    })
  },
  my_fans(){
    wx.navigateTo({
      url: '/pages/personal/my_fans/my_fans?userId='+this.data.userInfo._id,
    })
  },
})