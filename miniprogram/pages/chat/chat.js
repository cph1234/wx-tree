const app = getApp()
const db = wx.cloud.database()
const _ = db.command
 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    mess : '',
    content : [],//聊天信息
    mineAvatorSrc : '/images/user_male.jpg',
    himAvatorSrc : '/images/user_female.jpg',
    sendUser : {},
    receiveUser : {},
    currentId:''
	},
	
    //获取格式化的时间 yyyy-mm-dd-hh:mm-ss
	getFormatTime(){
		let date = new Date();
		let ymd = date.toISOString().substring(0,10);//年-月-日
		let hms = date.toTimeString().substring(0,8);//小时-分钟-秒钟
		console.log(ymd + "-" + hms);
		return ymd + " " + hms;//拼接
	},
 
  //“发送”
  sendMess(e){
    let content = this.data.content
    if (!this.data.mess.trim()) return
    let info = {
      sendId : this.data.sendUser._id,
      content : this.data.mess,
      timestamp : this.getFormatTime()
    }
    let that = this
    db.collection('chatContent')
      .doc(this.data.currentId)
      .update({
        data:{
          message : content.concat(info)
        }
      }).then(res=>{
        this.setData({
          mess:''
        })
        db.collection('userInfo').where({
          _id: that.data.receiveUser._id,
          current_chats: {
            userId: this.data.sendUser._id
          }
        })
        .get({
          success: function(res) {
            let addInfo={
              userId : info.sendId,
              content : info.content,
              time : info.timestamp,
              count : 1
            }
            console.log(res.data[0])
            if(res.data.length==0){
              db.collection('userInfo')
              .doc(that.data.receiveUser._id)
              .update({
                  data:{
                    current_chats:_.push(addInfo)
                  }
              })
            }else{
              let chats = res.data[0].current_chats
              console.log(chats)
              const chat = chats.find(item => item.userId === that.data.sendUser._id);
              console.log(chat)
              db.collection('userInfo')
              .where({
                _id:that.data.receiveUser._id,
                'current_chats.userId':that.data.sendUser._id
              })
              .update({
                  data:{
                      'current_chats.$.content':info.content,
                      'current_chats.$.time':info.timestamp,
                      'current_chats.$.count':chat.count+1,
                  }
              })
            }
          }
        })
      })
  },
 
  //初始化数据库的字段
  initChatContent(){
    let info = {}
    info.userId = [this.data.sendUser._id,this.data.receiveUser._id]
    info.message = []
    db.collection('chatContent')
      .add({
        data:info
      })
    this.queryChat()
  },
 
  //查询聊天
  queryChat(){
    let that = this;
    wx.showLoading({
      title: '查询...',
      mask: true,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {
        db.collection('chatContent')
        .where({
          userId:{
            $all: [this.data.sendUser._id,this.data.receiveUser._id]
          }
        })
        .get({
          success:function(res){
            if(res.data.length == 0){
              that.initChatContent();//初始化数据库字段
            }
            else{
              that.setData({
                currentId : res.data[0]._id,//设置当前的id
                content : res.data[0].message//赋值给当前的聊天循环体
              })
              //定位到最后一行
              that.setData({
                toBottom : `item${that.data.content.length - 1}`,
              })
            }
          },
          fail:function(err){
            console.log("查询失败！",err);
          },
          complete:function(){
            wx.hideLoading({
              noConflict: true,
              success: (res) => {},
              fail: (res) => {},
              complete: (res) => {},
            })
          }
        })
      },
    })
  },
  
  //数据库的监听器
  dbWatcher(){
	  let that = this;
    db.collection('chatContent').where({
      userId:{
        $all: [this.data.sendUser._id,this.data.receiveUser._id]
      }
    })
    .watch({
      onChange: function (res) {
        //监控数据发生变化时触发
        console.log("res:",res);
        if(res.docChanges != null){
          if(res.docChanges[0].dataType == "update"){//数据库监听到的内容
            let length = res.docChanges[0].doc.message.length;
            console.log("length : ",length);
            let value = res.docChanges[0].doc.message[length - 1];//要增添的内容
            console.log("value : ",value);
            that.setData({
              content : that.data.content.concat(value)
            })
            //定位到最后一行
            that.setData({
              toBottom : `item${that.data.content.length - 1}`,
            })
          }
        }
      },
      onError:(err) => {
        console.error(err)
      }
    })
  },
 
  //获取时间并格式化时间
  checkDateAndTime(){
    let date = new Date();
    let ymd = date.toISOString().substring(0,10);//年-月-日
    let time = date.toTimeString().substring(0,8);//时：分：秒
 
    console.log("年-月-日 : ",ymd);
    console.log("时：分：秒 : ",time);
 
    let resDate = ymd + '-' + time;
    console.log("resDate : ",resDate);
  },
 
 
  /**
   * 生命周期函数--监听页面加载
   */
    // 生命周期函数--监听页面加载
  onLoad: async function (options) {
    let sendUserId = options.sendUserId
    let receiveUserId = options.receiveUserId
    console.log(sendUserId)
    console.log(receiveUserId)
    let sendUser = await db.collection('userInfo')
    .doc(sendUserId)
    .get()
    let receiveUser = await db.collection('userInfo')
    .doc(receiveUserId)
    .get()
    this.setData({
      sendUser:sendUser.data,
      receiveUser:receiveUser.data
    })
    wx.setNavigationBarTitle({
      title: receiveUser.data.name
    })
    await this.queryChat();
    await this.dbWatcher();
  },
 
  onReady(){
 
  },
 
})