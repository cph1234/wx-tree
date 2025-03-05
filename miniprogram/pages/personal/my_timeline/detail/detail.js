// pages/personal/my_timeline/detail/detail.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeCircle:{},
    filterIndex: 0,
    hasNotification: true,
    dataList:[],
    showInputBox: false,
    comment: '',
    inputContent: '',
    userInfo:{},
    bottom:0,
    commentTreeId:'',
    commentUserId:'',
    textareaHeight:30,
    searchValue:'',
    commentUrl:'',
    sendCommentUserId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.getData(options.id)
  },

  async getData(id){
    let treeCircle = await db.collection("treeFriendsCircleInfo").doc(id).get()
    for(let item of treeCircle.data.comment){
      if(item.userId!=undefined&&item.userId!=""){
        let user = await db.collection("userInfo").doc(item.userId).get()
        item.userName1 = user.data.name
      }
      if(item.userId2!=undefined&&item.userId2!=""){
        let user2 = await db.collection("userInfo").doc(item.userId2).get()
        item.userName2 = user2.data.name
      }
    }
    treeCircle.data.create_time = this.checkDateAndTime(treeCircle.data.create_time)
    this.setData({
      treeCircle:treeCircle.data
    })
    db.collection("userInfo")
      .doc(treeCircle.data.userId)
      .get().then(res=>{
        this.setData({
          userInfo:res.data
        })
      })
  },
  thumbsUp(e){
    let treeId = e.currentTarget.dataset.id
    let likes=this.data.userInfo.my_likes
    let newArr = likes;
    let num=-1
    if(likes.includes(treeId)){
      //取消点赞、点赞数减一
      newArr = likes.filter((item) => item !== treeId);
      db.collection("userInfo")
      .doc(e.currentTarget.dataset.userid)
      .update({
        data:{
          current_likes:_.pull({
            userId: this.data.userInfo._id,
            treeCircleId:treeId
          })
        }
      })
    }else{
      newArr.push(treeId)
      num=1
      db.collection("userInfo")
      .doc(e.currentTarget.dataset.userid)
      .update({
        data:{
          current_likes:_.push({
            userId: this.data.userInfo._id,
            treeCircleId:treeId,
            time:wx.cloud.database().serverDate(),
            url:e.currentTarget.dataset.url
          })
        }
      })
    }
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).update({
      data:{
        my_likes:newArr
      }
    }).then(res=>{
      this.getUserInfo()
      const targetObj = this.data.treeCircle;
      if (targetObj) {
          targetObj.likes = targetObj.likes + num;
      }
      this.setData({
        treeCircle:targetObj
      })
      db.collection("treeFriendsCircleInfo")
      .doc(treeId)
      .update({
        data:{
          likes:_.inc(num)
        }
      }).then(res=>{
        console.log(res)
        
      })
    })
  },
  getUserInfo(){
    let user_openid = app.globalData.user_openid
    console.log(user_openid)
    db.collection("userInfo").where({
      _openid:user_openid
    }).get().then(res=>{
      this.setData({
        userInfo : res.data[0]
      })
    })
  },
  checkDateAndTime(e){
    let date = new Date(e);
    let ymd = date.toISOString().substring(0,10);//年-月-日
    let time = date.toTimeString().substring(0,8);//时：分：秒
    let resDate = ymd + ' ' + time;
    return resDate
  },
  hideComment(){
    this.setData({
      showInputBox:false
    })
  },
  previewImage: function(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片链接列表（此处仅为示例，实际应用中可能有多个链接）
    });
  },
  showInput: function(e) {
    console.log(e.currentTarget.dataset)
    this.setData({
      showInputBox: !this.data.showInputBox,
      commentTreeId: e.currentTarget.dataset.id,
      commentUserId: e.currentTarget.dataset.id2,
      sendCommentUserId: e.currentTarget.dataset.id3,
      commentUrl: e.currentTarget.dataset.url
    });
  },
  inputComment: function (e) {
    console.log()
    this.setData({
      inputValue: e.detail.value
    });
  },
  handleLineChange(e) {
    // 获取当前textarea的高度
    const height = e.detail.height;
    this.setData({
      textareaHeight: height
    });
  },
  // 提交评论按钮点击事件
  submitComment: function () {
    const inputValue = this.data.inputValue;
    
    if (inputValue.trim() === '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }
    db.collection("userInfo")
      .doc(this.data.sendCommentUserId)
      .update({
        data:{
          current_comments:_.push({
            userId: this.data.userInfo._id,
            treeCircleId:this.data.commentTreeId,
            time:wx.cloud.database().serverDate(),
            content:inputValue,
            url:this.data.commentUrl
          })
        }
      })
    const newComment = {
      userId: this.data.userInfo._id,
      userId2: this.data.commentUserId || "",
      content: inputValue
    };
    db.collection("treeFriendsCircleInfo")
      .doc(this.data.commentTreeId)
      .update({
        data:{
          comment:_.push(newComment)
        }
      }).then(res=>{
        let treeCircle = this.data.treeCircle
        newComment.userName1 = this.data.userInfo.name
        if(this.data.commentUserId!==null&&this.data.commentUserId!==""&&this.data.commentUserId!==undefined){
          db.collection("userInfo").doc(this.data.commentUserId).get()
          .then(res=>{
            newComment.userName2 = res.data.name
            treeCircle.comment.push(newComment);
            this.setData({
              treeCircle : treeCircle,
              showInputBox : false,
              inputValue: ''
            })
          })
        }else{
          treeCircle.comment.push(newComment);
          this.setData({
            treeCircle : treeCircle,
            showInputBox : false,
            inputValue: ''
          })
        }
        console.log(treeCircle)
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