// pages/home/message/message.js
Page({
  data: {
    currentTab: 1,
    counts: {
      like: 3,
      comment: 2,
      fans: 1
    },
    likeList: [
      {
        avatar: '/image/boy.png',
        username: 'Smile',
        content: '树',
        time: '14:20',
        previewImage: '/image/tree-1.png'
      },
      {
        avatar: '/images/avatar2.png',
        username: '奥利奥',
        content: '树',
        time: '10:20',
        previewImage: '/images/tree.jpg'
      },
      {
        avatar: '/images/avatar3.png',
        username: '爱德华',
        content: '树',
        time: '08:20',
        previewImage: '/images/tree.jpg'
      }
    ],
    commentList: [
      {
        avatar: '/image/boy.png',
        username: 'Smile',
        content: '有鸟归巢的呼唤，有夕阳滑过树梢的呢喃，有流水轻抚小桥的滋润，有天边的一朵云',
        time: '14:20',
        previewImage: '/image/tree-1.png'
      },
      {
        avatar: '/image/girl.png',
        username: '奥利奥',
        content: '有鸟归巢的呼唤，有夕阳滑过树梢的呢喃，有流水轻抚小桥的滋润，有天边的一朵云',
        time: '10:20',
        previewImage: '/image/tree-2.png'
      }
    ]
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      currentTab: index
    })
  }
})