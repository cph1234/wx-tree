// pages/personal/my_group/my_group.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    userInfo:{},
    followList: []
  },
  async onLoad(option){
    let userId = option.userId
    let treeType = option.treeType
    let res = await db.collection("userInfo").doc(userId).get()
    this.setData({
      userInfo : res.data
    })
    let my_team_member = res.data.my_team_member
    if(my_team_member.length!==0){
      let jsonData = app.globalData.jsonData;
      // 获取当前日期（只保留年月日部分）
      const now = new Date();
      now.setHours(0, 0, 0, 0); // 将时分秒置为 0
      const currentYear = now.getFullYear();

      // 1. 过滤出本年年初到当天日期的节气数据
      const filteredData = jsonData.filter(item => {
        const itemDate = new Date(item.time.replace(/-/g,'/'));
        itemDate.setHours(0, 0, 0, 0); // 将时分秒置为 0
        return (
          itemDate.getFullYear() === currentYear && // 年份为当前年份
          itemDate <= now // 日期小于等于当前日期
        );
      });

      // 2. 统计符合条件的节气数量
      let totalCount = filteredData.length;
      console.log(filteredData);
      let nextJieqi
      let preJieqi
      let currentTime = this.getCurrentTime()
      // 3. 判断下一个节气是否在 3 天内
      for (const index in jsonData) {
        if (new Date(jsonData[index].time.replace(/-/g,'/')).setHours(0, 0, 0, 0) > new Date(currentTime.replace(/-/g,'/')).setHours(0, 0, 0, 0)) {
          nextJieqi = jsonData[index]
          nextJieqi.time = nextJieqi.time.replace(/-/g,'/')
          preJieqi = jsonData[index-1]
          preJieqi.time = preJieqi.time.replace(/-/g,'/')
          break;
        }
      }
      console.log(nextJieqi)
      let timeDiffInDays = null;
      const nextTime = new Date(nextJieqi.time);
      nextTime.setHours(0, 0, 0, 0); // 忽略时间部分
      timeDiffInDays = Math.floor((new Date() - nextTime) / (1000 * 60 * 60 * 24)); // 转换为天数
      // 判断时间差是否在三天内
      let result = null;
      if (timeDiffInDays !== null && Math.abs(timeDiffInDays) <= 3) {
        result = nextJieqi;
        totalCount++;
      } else {
        result = preJieqi;
      }
      console.log(totalCount)
      let team = await db.collection("userInfo").where({_id:_.in(my_team_member)}).get()
      let teamData = team.data
      for(let user of teamData){
        let treeInfo = await db.collection("treeInfo").where({userId:user._id,treeType:treeType}).get()
        let homework = treeInfo.data[0].homework
        const currentYear = new Date().getFullYear().toString();
        const count = homework.filter(item => item.year === currentYear).length;
        user.count = totalCount-count
        console.log(homework)
        const currentCount = homework.filter(item => item.year === currentYear&&item.name==result.name).length;
        user.currentCount = currentCount == 0?false:true
      }
      this.setData({
        followList : teamData
      })
    }else{
      wx.showToast({
        title: '不存在组员用户！',
        icon: 'none'
      })
    }
  },
  getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  },
  homework(e){
    wx.navigateTo({
      url: '/pages/personal/my_homework/my_homework?userId='+e.currentTarget.dataset.id,
    })
  }
})