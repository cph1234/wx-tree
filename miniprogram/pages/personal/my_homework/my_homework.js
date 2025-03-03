// pages/personal/my_timeline/my_timeline.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    selectedYear:new Date().getFullYear(),
    treeInfo: [],
    year:[]
  },
  onLoad(){
    let year=[]
    for (let i = -10; i <= 10; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setData({
      year:year
    })
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      this.setData({
        userInfo:res.data[0]
      })
      console.log(res.data)
      this.getData(new Date().getFullYear())
    })
    
  },
  async getData(y){
    const currentYear = y
    const nextYear = y + 1
    const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
    const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
    console.log(startDate)
    console.log(endDate)
    let trees = await db.collection("treeInfo")
    .where({
        userId:this.data.userInfo._id,
        createTime:_.and(
          _.gte(startDate),
          _.lt(endDate)
        )
    })
    .get()
    let treeInfo = trees.data
    for(let item of treeInfo){
      item.list=[]
      let homework = await db.collection("homeworkInfo")
      .where({
          userId:this.data.userInfo._id,
          create_time:_.and(
            _.gte(startDate),
            _.lt(endDate)
          ),
          treeType:item.treeType
      }).orderBy('create_time', 'desc')
      .get()
      for(let iten of homework.data){
        let info = {}
        let create_time = new Date(iten.create_time)
        info.month = create_time.getMonth() + 1;
        info.day = create_time.getDate();
        info.id = iten._id
        for(let iteb of iten.details){
          if(iteb.files.length!=0){
            info.url = iteb.files[0]
            break
          }
        }
        item.list.push(info)
      }
    }
    this.setData({
      treeInfo:treeInfo
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
})