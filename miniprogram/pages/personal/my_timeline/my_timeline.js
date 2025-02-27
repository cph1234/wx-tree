// pages/personal/my_timeline/my_timeline.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    selectedYear:new Date().getFullYear(),
    timeline: [
      {
        year: 2024,
        entries: [
          {
            day: 26,
            month: 11,
            image: '/image/tree-1.png',
            description: '这棵树的树皮呈灰褐色，布满裂纹，透露出一种沧桑感。树冠茂密，绿叶层层叠叠，为大地投下一片...'
          },
          // 其他月份数据...
        ]
      },
      {
        year: 2023,
        entries: [
          {
            day: 11,
            month: 12,
            image: '/image/tree-2.png',
            description: '这棵树的树皮呈灰褐色，布满裂纹，透露出一种沧桑感。树冠茂密，绿叶层层叠叠，为大地投下一片...'
          },
          {
            day: 11,
            month: 10,
            image: '/image/tree-2.png',
            description: '这棵树的树皮呈灰褐色，布满裂纹，透露出一种沧桑感。树冠茂密，绿叶层层叠叠，为大地投下一片...'
          }
        ]
      },
      {
        year: 2022,
        entries: [
          {
            day: 12,
            month: 12,
            image: '/image/tree-2.png',
            description: '这棵树的树皮呈灰褐色，布满裂纹，透露出一种沧桑感。树冠茂密，绿叶层层叠叠，为大地投下一片...'
          }
        ]
      }
    ],
    year:[]
  },
  onLoad(){
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      this.setData({
        userInfo:res.data
      })
      console.log(res.data[0]._id)
      const currentYear = new Date().getFullYear()
      const nextYear = new Date().getFullYear() + 1
      const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
      const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
      let year=[]
      for (let i = -10; i <= 10; i++) {
        year.push(currentYear + i);
      }
      this.setData({
        year:year
      })
      db.collection("treeFriendsCircleInfo")
      .where({
          userId:res.data[0]._id,
          create_time:_.and(
            _.gte(startDate),
            _.lt(endDate)
          )
      }).skip(this.data.timeline.length)
      .limit(5)
      .get()
      .then(res=>{
        let treeCircle = res.data
        let timeline = this.data.timeline
        for(let item of treeCircle){
          let info={}
          date = new Date(item.create_time);
          info.year = date.getFullYear();
          info.month = date.getMonth() + 1;
          info.day = date.getDate();
          info.url = item.files[0]
          info.content = item.content
          info._id = item._id
          timeline.push(info)
        }
        this.setData({
          timeline:timeline
        })
      })
    })
    
  },
  bindYearChange(e) {
    console.log(e)
    this.setData({
      index: e.detail.value,
      selectedYear: this.data.year[e.detail.value]
    })
    const currentYear = this.data.year[e.detail.value]
    const nextYear = currentYear + 1
    const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
    const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
    db.collection("treeFriendsCircleInfo")
    .where({
        userId:this.data.userInfo._id,
        create_time:_.and(
          _.gte(startDate),
          _.lt(endDate)
        )
    }).get().then(res=>{
      let treeCircle = res.data
      console.log(treeCircle)
    })
  },
})