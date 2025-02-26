// pages/personal/my_group/my_group.js
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
      let my_team_member = res.data.my_team_member
      if(my_team_member.length!==0){
        db.collection("userInfo")
        .where({_id:_.in(my_team_member)})
        .get().then(res=>{
          this.setData({
            followList:res.data
          })
        })
      }else{
        wx.showToast({
          title: '不存在组员用户！',
          icon: 'none'
        })
      }
    })
  },
  homework(){
    
  }
})