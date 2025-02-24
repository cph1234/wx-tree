// pages/personal/my_fans/my_fans.js
Page({
  data: {
    followList: [
      {
        avatar: '/image/girl.png',
        username: '软萌的小猫',
        badges: ['tree','tree','tree'],
        isFollowed: false
      },
      {
        avatar: '/image/boy.png',
        username: '爱德华',
        badges: ['tree'],
        isFollowed: true
      },
      {
        avatar: '/image/boy.png',
        username: '巴伦亚na',
        badges: ['tree', 'tree'],
        isFollowed: true
      },
      // 其他关注项...
    ]
  }
})