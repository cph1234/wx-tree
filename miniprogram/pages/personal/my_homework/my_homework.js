// pages/personal/my_homework/my_homework.js
Page({
  data: {
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
    ]
  }
})