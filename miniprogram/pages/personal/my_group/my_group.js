// pages/personal/my_group/my_group.js
Page({
  data: {
    followList: [
      {
        avatar: '/image/girl.png',
        username: '软萌的小猫',
        submitted: true,
        unsubmittedCount: 0
      },
      {
        avatar: '/image/boy.png',
        username: '爱德华',
        submitted: false,
        unsubmittedCount: 3
      },
      {
        avatar: '/image/boy.png',
        username: '巴伦亚na',
        submitted: true,
        unsubmittedCount: 4
      },
      // 其他关注项...
    ]
  }
})