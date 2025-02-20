// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
    const condition = event.condition
    const userId = event.userId
    const page = event.page
    //全部 0 点赞 1 关注 2 组员3
    if(condition=="0"){
      try {
        let list=[]
        let data = await db.collection("treeFriendsCircleInfo").skip(page)
        .limit(5).get()
        for(let item of data.data){
          for(iten of item.comment){
            let userInfo1 = await db.collection("userInfo").doc(iten.userId).get()
            iten.userName1 = userInfo1.data.name
            if(iten.userId2!==null&&iten.userId2!==""){
              let userInfo2 = await db.collection("userInfo").doc(iten.userId2).get()
              iten.userName2 = userInfo2.data.name
            }
          }
          let userInfo = await db.collection("userInfo").doc(item.userId).get()
          list.push({...item,...userInfo})
        }
        return list
      } catch (e) {
          console.error(e)
      }
    }else if(condition=="2"){
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
        let list=[]
        const data = await db.collection('treeFriendsCircleInfo')
          .where({
            userId: _.in(attentions)
          })
          .skip(page)
          .limit(5)
          .get();
        for(let item of data.data){
          for(iten of item.comment){
            let userInfo1 = await db.collection("userInfo").doc(iten.userId).get()
            iten.userName1 = userInfo1.data.name
            if(iten.userId2!==null&&iten.userId2!==""){
              let userInfo2 = await db.collection("userInfo").doc(iten.userId2).get()
              iten.userName2 = userInfo2.data.name
            }
          }
          let userInfo = await db.collection("userInfo").doc(item.userId).get()
          list.push({...item,...userInfo})
        }
        return list
      } catch (error) {
        console.error(error);
        return [];
      }
    }else if(condition=="3"){
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
        let list=[]
        const data = await db.collection('treeFriendsCircleInfo')
          .where({
            userId: _.in(members)
          })
          .skip(page)
          .limit(5)
          .get();
        for(let item of data.data){
          for(iten of item.comment){
            let userInfo1 = await db.collection("userInfo").doc(iten.userId).get()
            iten.userName1 = userInfo1.data.name
            if(iten.userId2!==null&&iten.userId2!==""){
              let userInfo2 = await db.collection("userInfo").doc(iten.userId2).get()
              iten.userName2 = userInfo2.data.name
            }
          }
          let userInfo = await db.collection("userInfo").doc(item.userId).get()
          list.push({...item,...userInfo})
        }
        return list
      } catch (error) {
        console.error(error);
        return [];
      }
    }else if(condition=="1"){
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
      const likes = userInfo.my_likes || []; // 确保 members 是一个数组，即使为空
      let list=[]
      const data = await db.collection('treeFriendsCircleInfo')
        .where({
          _id: _.in(likes)
        })
        .skip(page)
        .limit(5)
        .get();
      for(let item of data.data){
        for(iten of item.comment){
          let userInfo1 = await db.collection("userInfo").doc(iten.userId).get()
          iten.userName1 = userInfo1.data.name
          if(iten.userId2!==null&&iten.userId2!==""){
            let userInfo2 = await db.collection("userInfo").doc(iten.userId2).get()
            iten.userName2 = userInfo2.data.name
          }
        }
        let userInfo = await db.collection("userInfo").doc(item.userId).get()
        list.push({...item,...userInfo})
      }
      return list
    }
    
}