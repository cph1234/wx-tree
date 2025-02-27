// pages/personal/tree_manage/tree_info_add/tree_info_add.js
// Page.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    selectedIcon: '/image/radio-selected.png', // 选中图标路径
    unselectedIcon: '/image/radio-normal.png', // 未选中图标路径
    radioListSoilType: [
      { value: 'loam', label: '壤土', checked: false },
      { value: 'sand', label: '砂土', checked: false },
      { value: 'clay', label: '粘土', checked: false },
      { value: 'unknow', label: '未知', checked: false }
    ],
    radioListSunlight: [
      { value: 'full', label: '全日照', checked: false },
      { value: 'morning', label: '上午日照', checked: false },
      { value: 'afternoon', label: '下午日照', checked: false },
      { value: 'none', label: '全阴', checked: false }
    ],
    altitude:'',
    position:'',
    soil:'',
    sunshine:'',
    treeDimensions1:'',
    treeDimensions2:'',
    treeDimensions3:'',
    treeType:'',
    weather:'',
    userInfo:{}
  },
  onLoad(options){
    db.collection("userInfo")
    .doc(options.userId)
    .get().then(res=>{
      this.setData({
        userInfo:res.data
      })
    })
  },
  // 单选切换事件
  radioChange(e) {
    const value = e.detail.value;
    const radioListSunlight = this.data.radioListSunlight.map(item => ({
      ...item,
      checked: item.value === value
    }));
    this.setData({radioListSunlight});
  },

  radioChange2(e) {
    const value = e.detail.value;
    console.log(e)
    const radioListSoilType = this.data.radioListSoilType.map(item => ({
      ...item,
      checked: item.value === value
    }));
    this.setData({radioListSoilType});
  },
  treeType(e){
    this.setData({
      treeType : e.detail.value
    })
  },
  altitude(e){
    this.setData({
      altitude : e.detail.value
    })
  },
  position(e){
    this.setData({
      position : e.detail.value
    })
  },
  soil(e){
    this.setData({
      soil : e.detail.value
    })
  },
  sunshine(e){
    this.setData({
      sunshine : e.detail.value
    })
  },
  treeType(e){
    this.setData({
      treeType : e.detail.value
    })
  },
  weather(e){
    this.setData({
      weather : e.detail.value
    })
  },
  treeDimensions1(e){
    this.setData({
      treeDimensions1 : e.detail.value
    })
  },
  treeDimensions2(e){
    this.setData({
      treeDimensions2 : e.detail.value
    })
  },
  treeDimensions3(e){
    this.setData({
      treeDimensions3 : e.detail.value
    })
  },
  addTree(){
    let info = {}
    info.altitude = this.data.altitude
    info.createTime = wx.cloud.database().serverDate()
    info.position = this.data.position
    info.treeDimensions = '胸径'+this.data.treeDimensions1+' 树高'+this.data.treeDimensions2+' 冠幅'+this.data.treeDimensions3
    info.treeType = this.data.treeType
    info.userId = this.data.userInfo._id
    info.weather = this.data.weather
    this.data.radioListSoilType.forEach(item=>{
      if(item.checked){
        info.soil = item.label
      }
    })
    this.data.radioListSunlight.forEach(item=>{
      if(item.checked){
        info.sunshine = item.label
      }
    })
    db.collection("treeInfo")
    .add({
      data:info
    }).then(res=>{
      wx.navigateBack({
        delta: 1, // 返回的页面数，如果只有一个页面则写1
      });
    })
  }
});