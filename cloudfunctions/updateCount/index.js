// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 批量更新所有记录的count字段为0
    const result = await db.collection('userInfo')
      .where({}) // 条件为空，匹配所有记录
      .update({
        data: {
          tree_circle_count: _.set(0),
          tree_homework_count: _.set(0)
        }
      });
    console.log('更新结果:', result);
    return result;
  } catch (e) {
    console.error('更新失败:', e);
    return { code: -1, error: e };
  }
}