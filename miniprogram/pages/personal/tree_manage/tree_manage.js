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
    treeInfo:[]
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
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      this.setData({
        userInfo:res.data[0]
      })
      db.collection("treeInfo").where({
        userId:res.data[0]._id
      }).get().then(res=>{
        this.setData({
          treeInfo:res.data
        })
      })
    })
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