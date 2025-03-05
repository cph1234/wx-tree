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
    counts: {
      like: 3,
      comment: 2,
      fans: 1
    },
    likeList: [
      {
        avatar: '/image/boy.png',
        username: 'Smile',
        content: '树',
        time: '14:20',
        previewImage: '/image/tree-1.png'
      },
      {
        avatar: '/images/avatar2.png',
        username: '奥利奥',
        content: '树',
        time: '10:20',
        previewImage: '/images/tree.jpg'
      },
      {
        avatar: '/images/avatar3.png',
        username: '爱德华',
        content: '树',
        time: '08:20',
        previewImage: '/images/tree.jpg'
      }
    ],
    commentList: [
      {
        avatar: '/image/boy.png',
        username: 'Smile',
        content: '有鸟归巢的呼唤，有夕阳滑过树梢的呢喃，有流水轻抚小桥的滋润，有天边的一朵云',
        time: '14:20',
        previewImage: '/image/tree-1.png'
      },
      {
        avatar: '/image/girl.png',
        username: '奥利奥',
        content: '有鸟归巢的呼唤，有夕阳滑过树梢的呢喃，有流水轻抚小桥的滋润，有天边的一朵云',
        time: '10:20',
        previewImage: '/image/tree-2.png'
      }
    ]
  },
  onLoad(options){
    this.getData(options.userId)
  },
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      currentTab: index
    })
  },
  async getData(id){
    let userInfo = await db.collection("userInfo")
    .doc(id)
    .get()
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
  },
  checkDateAndTime(e){
    let date = new Date(e);
    let ymd = date.toISOString().substring(0,10);//年-月-日
    let time = date.toTimeString().substring(0,8);//时：分：秒
    let resDate = ymd + ' ' + time;
    return resDate
  },
})