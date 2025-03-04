// pages/personal/tree_manage/tree_manage.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    treeInfo:[],
    selectedYear:new Date().getFullYear(),
    year:[]
  },
  addTree(){
    wx.navigateTo({
      url: '/pages/personal/tree_manage/tree_info_add/tree_info_add?userId='+this.data.userInfo._id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let year=[]
    for (let i = -10; i <= 10; i++) {
      year.push(new Date().getFullYear() + i);
    }
    this.setData({
      year:year
    })
    this.getData(new Date().getFullYear())
  },
  getData(y){
    const currentYear = y
    const nextYear = y + 1
    const startDate = new Date(currentYear + '-01-01T00:00:00.000Z')
    const endDate = new Date(nextYear + '-01-01T00:00:00.000Z')
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      this.setData({
        userInfo:res.data[0]
      })
      db.collection("treeInfo").where({
        userId:res.data[0]._id,
        createTime:_.and(
          _.gte(startDate),
          _.lt(endDate)
        )
      }).get().then(res=>{
        this.setData({
          treeInfo:res.data
        })
      })
    })
  },
  bindYearChange(e) {
    console.log(e)
    this.setData({
      selectedYear: this.data.year[e.detail.value]
    })
    this.setData({
      timeline:[]
    })
    this.getData(this.data.year[e.detail.value])
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    db.collection("treeInfo").where({
      userId:this.data.userInfo._id
    }).get().then(res=>{
      this.setData({
        treeInfo:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})