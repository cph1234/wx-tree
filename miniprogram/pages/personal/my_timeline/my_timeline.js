// pages/personal/my_timeline/my_timeline.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    selectedYear:new Date().getFullYear(),
    timeline: [],
    year:[],
    circleUser:''
  },
  onLoad(options){
    console.log(options)
    this.setData({
      circleUser:options.userId
    })
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
      wx.setNavigationBarTitle({
        title: res.data.name+'的观察'
      })
      this.getData(new Date().getFullYear())
    })
    
  },
  getData(y){
    const currentYear = y
    const nextYear = y + 1
    const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
    const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
    let length = 0;
    for(let item of this.data.timeline){
      length = length + item.data.length
    }
    console.log(length)
    db.collection("treeFriendsCircleInfo")
    .where({
        userId:this.data.userInfo._id,
        // create_time:_.and(
        //   _.gte(startDate),
        //   _.lt(endDate)
        // )
    }).orderBy('create_time', 'desc')
    .skip(length)
    .limit(5)
    .get()
    .then(res=>{
      let treeCircle = res.data
      console.log(treeCircle)
      let timeline = []
      for(let item of treeCircle){
        let info={}
        let date = new Date(item.create_time);
        info.year = date.getFullYear();
        info.month = date.getMonth() + 1;
        info.day = date.getDate();
        info.url = item.fileIds[0]
        info.content = item.content
        info._id = item._id
        if (!timeline[info.year]) {
          timeline[info.year] = [];
        }
        timeline[info.year].push(info);
      }
      let timelines = Object.keys(timeline).map(year => ({
        year: parseInt(year, 10),
        data: timeline[year]
      }));
      console.log(timelines)
      let time = this.mergeYearArrays(this.data.timeline,timelines)
      console.log(time)
      this.setData({
        timeline:time
      })
    })
  },
  mergeYearArrays(...arrays) {
    const yearMap = {};
    // 遍历所有数组
    for (const arr of arrays) {
      for (const { year, data } of arr) {
        if (!yearMap[year]) {
          yearMap[year] = { year, data: [] };
        }
        yearMap[year].data.push(...data); // 合并data数组
      }
    }
    // 转换为数组并按年份排序（可选）
    return Object.values(yearMap).sort((a, b) => b.year - a.year);
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
  },
  chat(e){
    let userId = e.currentTarget.dataset.userid
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      wx.navigateTo({
        url: '/pages/chat/chat?sendUserId='+res.data[0]._id+'&receiveUserId='+userId // 目标页面路径，支持传递参数
      });
    })
  },
})