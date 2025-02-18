// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const condition = event.condition
    const userId = event.userId
    const page = event.page
    //全部
    if(condition=="all"){
      try {
        return await db.collection("treeFriendsCircleInfo").skip(page * 5)
        .limit(5).get()
      } catch (e) {
          console.error(e)
      }
    }else if(condition=="attention"){
      try {
        // 查询 userInfo 表，获取 attentions 数组
        const userInfoResult = await db.collection('userInfo')
          .where({
            _id: userId // 假设 userId 是 userInfo 表中的 _id 字段，根据实际情况调整
          })
          .get();
     
        if (userInfoResult.data.length === 0) {
          return [];
        }
     
        const userInfo = userInfoResult.data[0];
        const attentions = userInfo.my_attention || []; // 确保 likes 是一个数组，即使为空
     
        // 根据 attentions 数组中的 userId 查询 circle 表
        const circleResult = await db.collection('treeFriendsCircleInfo')
          .where({
            userId: _.in(attentions)
          })
          .get();
     
        return circleResult;
      } catch (error) {
        console.error(error);
        return [];
      }
    }else if(condition=="member"){
      try {
        // 查询 userInfo 表，获取 members 数组
        const userInfoResult = await db.collection('userInfo')
          .where({
            _id: userId // 假设 userId 是 userInfo 表中的 _id 字段，根据实际情况调整
          })
          .get();
     
        if (userInfoResult.data.length === 0) {
          return [];
        }
     
        const userInfo = userInfoResult.data[0];
        const members = userInfo.my_team_member || []; // 确保 members 是一个数组，即使为空
     
        // 根据 members 数组中的 userId 查询 circle 表
        const circleResult = await db.collection('treeFriendsCircleInfo')
          .where({
            userId: _.in(members)
          })
          .get();
     
        return circleResult;
      } catch (error) {
        console.error(error);
        return [];
      }
    }else if(condition=="likes"){
      const circleResult = await db.collection('treeFriendsCircleInfo')
          .where({
            likes: _.neq(0)
          })
          .get();
      return circleResult;
    }
    
}