// pages/personal/my_follow/my_follow.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    followList: []
  },
  onLoad(option){
    let userId = option.userId
    db.collection("userInfo")
    .doc(userId).get().then(res=>{
      this.setData({
        userInfo : res.data
      })
      console.log(res)
      let attention = res.data.my_attention
      if(attention.length!==0){
        db.collection("userInfo")
        .where({_id:_.in(attention)})
        .get().then(res=>{
          this.setData({
            followList:res.data
          })
        })
      }else{
        wx.showToast({
          title: '不存在关注用户！',
          icon: 'none'
        })
      }
    })
  },
  attention(e){
    let my_attention = this.data.userInfo.my_attention
    let index = my_attention.indexOf(e.currentTarget.dataset.id);
    if (index > -1) {
      my_attention.splice(index, 1);
    }else{
      my_attention.push(e.currentTarget.dataset.id)
    }
    let userInfo = this.data.userInfo
    userInfo.my_attention = my_attention
    this.setData({
      userInfo:userInfo
    })
    db.collection("userInfo")
    .doc(userInfo._id).update({
      data:{
        my_attention:my_attention
      }
    })
    console.log(userInfo)
  }
})