// pages/home/message/message.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    currentTab: 0,
    userInfo:{},
    current_likes:[],
    current_comments:[],
    current_fans:[],
  },
  onLoad(options){
    this.getData(options.userId)
  },
  onShow(){
    this.getData(this.data.userInfo._id)
  },
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      currentTab: index
    })
    if(index==1){
      db.collection("userInfo")
        .doc(this.data.userInfo._id)
        .update({
          data:{
            current_comments:[]
          }
        })
    }else{
      db.collection("userInfo")
        .doc(this.data.userInfo._id)
        .update({
          data:{
            current_fans:[]
          }
        })
    }
  },
  async getData(id){
    let userInfo = await db.collection("userInfo")
    .doc(id)
    .get()
    this.setData({
      userInfo:userInfo.data
    })
    let current_likes = userInfo.data.current_likes
    if(current_likes==undefined||current_likes.length==0){
      current_likes = []
    }else{
      for(let item of current_likes){
        let like = await db.collection("userInfo")
        .doc(item.userId)
        .get()
        item.avatar_url = like.data.avatar_url
        item.name = like.data.name
        item.time = this.checkDateAndTime(item.time)
      }
      console.log(current_likes)
      this.setData({
        current_likes:current_likes
      })
    }

    let current_comments = userInfo.data.current_comments
    if(current_comments==undefined||current_comments.length==0){
      current_comments = []
    }else{
      for(let item of current_comments){
        let like = await db.collection("userInfo")
        .doc(item.userId)
        .get()
        item.avatar_url = like.data.avatar_url
        item.name = like.data.name
        item.time = this.checkDateAndTime(item.time)
      }
      console.log(current_comments)
      this.setData({
        current_comments:current_comments
      })
    }

    let current_fans = userInfo.data.current_fans
    if(current_fans==undefined||current_fans.length==0){
      current_fans = []
    }else{
      for(let item of current_fans){
        let like = await db.collection("userInfo")
        .doc(item.userId)
        .get()
        item.avatar_url = like.data.avatar_url
        item.name = like.data.name
        item.time = this.checkDateAndTime(item.time)
      }
      console.log(current_fans)
      this.setData({
        current_fans:current_fans
      })
    }

    let current_chats = userInfo.data.current_chats
    if(current_chats==undefined||current_chats.length==0){
      current_chats = []
    }else{
      console.log(current_chats)
      for(let item of current_chats){
        let chat = await db.collection("userInfo")
        .doc(item.userId)
        .get()
        item.avatar_url = chat.data.avatar_url
        item.name = chat.data.name
        item.time = this.checkDateAndTime(item.time)
      }
      console.log(current_chats.filter(item=>item.count!==0).length)
      this.setData({
        current_chats:current_chats,
        chat_count:current_chats.filter(item=>item.count!==0).length
      })
    }

    db.collection("userInfo")
    .doc(userInfo.data._id)
    .update({
      data:{
        current_likes:[]
      }
    })
  },
  checkDateAndTime(e){
    let date = new Date(e);
    let ymd = date.toISOString().substring(0,10);//年-月-日
    let time = date.toTimeString().substring(0,8);//时：分：秒
    let resDate = ymd + ' ' + time;
    return resDate
  },
  goToChat(e){
    let userId = e.currentTarget.dataset.id
    db.collection('userInfo')
    .where({
      _id:this.data.userInfo._id,
      'current_chats.userId':userId
    })
    .update({
        data:{
            'current_chats.$.count':0,
        }
    })
    wx.navigateTo({
      url: '/pages/chat/chat?sendUserId='+this.data.userInfo._id+'&receiveUserId='+userId // 目标页面路径，支持传递参数
    });

  }
})