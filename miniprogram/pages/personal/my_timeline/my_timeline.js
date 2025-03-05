// pages/personal/my_timeline/my_timeline.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    selectedYear:new Date().getFullYear(),
    timeline: [],
    year:[]
  },
  onLoad(options){
    console.log(options)
    let year=[]
    for (let i = -10; i <= 10; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setData({
      year:year
    })
    db.collection("userInfo")
    .doc(options.userId)
    .get().then(res=>{
      this.setData({
        userInfo:res.data
      })
      console.log(res.data)
      this.getData(new Date().getFullYear())
    })
    
  },
  getData(y){
    const currentYear = y
    const nextYear = y + 1
    const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
    const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
    console.log(startDate)
    console.log(endDate)
    db.collection("treeFriendsCircleInfo")
    .where({
        userId:this.data.userInfo._id,
        create_time:_.and(
          _.gte(startDate),
          _.lt(endDate)
        )
    }).orderBy('create_time', 'desc')
    .skip(this.data.timeline.length)
    .limit(5)
    .get()
    .then(res=>{
      let treeCircle = res.data
      console.log(treeCircle)
      let timeline = this.data.timeline
      for(let item of treeCircle){
        let info={}
        let date = new Date(item.create_time);
        info.year = date.getFullYear();
        info.month = date.getMonth() + 1;
        info.day = date.getDate();
        info.url = item.fileIds[0]
        info.content = item.content
        info._id = item._id
        timeline.push(info)
      }
      this.setData({
        timeline:timeline
      })
    })
  },
  bindYearChange(e) {
    console.log(e)
    this.setData({
      selectedYear: this.data.year[e.detail.value]
    })
    this.setData({
      timeline:[]
    })
    this.getData(this.data.year[e.detail.value])
  },
  /**
   * 上拉加载更多
   */
  onReachBottom: function() {
    this.getData(this.data.selectedYear)
  },
  detail(e){
    wx.navigateTo({
      url: '/pages/personal/my_timeline/detail/detail?id='+e.currentTarget.dataset.id,
    })
  }
})