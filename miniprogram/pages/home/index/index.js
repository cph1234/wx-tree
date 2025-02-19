// pages/home/index/index.js
const app = getApp()
const config = require("../../../config.js");
const db = wx.cloud.database()
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    // data: {
    //   filterList: ['全部', '点赞', '关注'],
    //     filterIndex: 0,
    //     hasNotification: true,
    //     showselect: false,
    //     show_auth: false,
    //     userInfo: {},
    //     images:['https://pic.52112.com/2020/04/13/JPG-200413_328/gCaPae4zjp_small.jpg'],
    //     hasUserInfo: false,
    //     school: '',
    //     praiseBorder: '',
    //     notPraiseBorder: '',
    //     posts: [],
    //     postType: 1,
    //     baseImageUrl: app.globalData.imageUrl,
    //     show: 0,
    //     hidden: false,
    //     showCommentInput: false,
    //     commentContent: '',
    //     commentObjId: '',
    //     commentType: '',
    //     refcommentId: '',
    //     posteropenid: '',
    //     filter: '',
    //     pageSize: 10,
    //     pageNumber: 1,
    //     initPageNumber: 1,
    //     showGeMoreLoadin: false,
    //     currentTime: '',
    //     notDataTips: false,
    //     newMessage: false,
    //     newMessageNumber: 0,
    //     select: 1,
    //     animationData: {},
    //     commentValue: '',
    //     showNormal: false,
    //     showAudit: false,
    //     topic: {
    //         content: '',
    //         attachments: '',
    //         praise_number: '',
    //         id: ''
    //     },
    //     commentInfo: {
    //         title: '',
    //         placeholder: '',
    //         btn: ''
    //     },
    //     showpostbtn: true,
    //     showposts: true,
    //     showTopic: false,
    //     showSelect: false,
    //     showBegin: true,
    //     showCancel: false,
    //     showReport: false,
    //     bindReport: false,
    //     showSubmit: false,
    //     showSearch: false,
    //     tryAgant: false,
    //     imageLeft: '',
    //     imageRight: '',
    //     postImageLeft: '',
    //     PostImageRight: '',
    //     rate: 0,
    //     face: '',
    //     conclusion: '',
    //     canComment: true,
    //     sharecomeIn: false,
    //     shareId: '',
    //     shareType: '',
    //     param: app.globalData.param,
    //     messagefunc: Object,
    //     zanstatu: []
    // },

    data: {
      filterList: ['全部', '点赞', '关注'],
      filterIndex: 0,
      hasNotification: true,
      dataList:[],
      showInputBox: false,
      comment: '',
      inputContent: ''
    },
    getData(condition,page){
      console.log(page)
      wx.cloud.callFunction({
        name:"queryTreeFriendCircle",
        data:{
          condition:condition,
          page:page
        }
      }).then(res=>{
        let oldData = this.data.dataList
        console.log(res.result) 
        let newData = oldData.concat(res.result)
        console.log(newData)
        this.setData({
          dataList:newData
        })
        console.log(this.data.dataList)
      })
    },
    onFilterChange(e) {
      this.setData({
        filterIndex: e.detail.value
      })
    },
  
    // 显示输入框
    showInput: function() {
      this.setData({
        showInputBox: true
      });
      this.setData({
        inputContent: '' // 清空输入框内容
      });
      this.inputCtx = wx.createSelectorQuery().select('#commentInput');
      this.inputCtx.context(function(res) {
        res.context.setFocus();
      }).exec();
    },
  
    // 处理输入
    handleInput: function(e) {
      this.setData({
        inputContent: e.detail.value
      });
    },
  
    // 确认输入
    confirmInput: function() {
      this.setData({
        comment: this.data.inputContent,
        showInputBox: false
      });
      wx.showToast({
        title: '评论已保存',
        icon: 'success'
      });
    },
  
    // 取消输入
    cancelInput: function() {
      this.setData({
        showInputBox: false,
        inputContent: ''
      });
    },
    onSearch(e) {
      const keyword = e.detail.value
      // 处理搜索逻辑
    },

    // showselect
    showselect: function() {
        this.setData({
            showselect: true
        })
    },

    // 创建新的消息盒子
    message: function(data) {
        // 评论、点赞人昵称
        var nickname = data.nickname
        // 评论、点赞人头像
        var avatar = data.avatar
        // 更新时间
        var updatetime = app.getnowtime()
        // 评论、点赞内容
        var content = data.content
        // 接收的用户openid
        var messageuser = data.messageuser
        // 当前帖子id
        var objId = data.objId
        // 帖子类型
        var obj_type = data.obj_type
        // 更新消息
        const db = wx.cloud.database()
        db.collection('message').add({
            data: {
                "from_user": {
                    "avatar": avatar,
                    "nickname": nickname
                },
                "created_at": updatetime,
                "content": content,
                "isread": false,
                "messageuser": messageuser,
                "objId": objId,
                "obj_type": obj_type

            },
            success(res) {
                // console.log('messageres',res)
            },
            fail: console.log
        })
    },
    // 获取新的消息盒子提醒
    newmessage: function() {
        var that = this
        const db = wx.cloud.database()
        db.collection('message')
            .orderBy('created_at', 'desc')
            .where({
                messageuser: app.globalData.userId
            })
            .get({
                success(res) {
                    console.log('newmessage', res)
                    var data = res.data
                    // 未读新消息数,初始化为0
                    var newMessageNumber = 0
                    var list = []
                    for (var i = 0; i < data.length; i++) {
                        // 未读消息
                        if (!data[i].isread) {
                            newMessageNumber = newMessageNumber + 1
                        }
                        // 未读消息id
                        // list.push(data[i]._id)
                    }
                    // 判断是否有新消息
                    if (newMessageNumber > 0) {
                        that.setData({
                            newMessageNumber: newMessageNumber,
                            newMessage: true
                        })
                    }
                }
            })
    },
    // 进入消息页面
    openMessage: function() {
        console.log(app.globalData.userId)
        var that = this
        wx.cloud.callFunction({
            name: 'Message',
            data: {
                id: app.globalData.userId
            },
            success: res => {
                console.log,
                    wx.navigateTo({
                        url: '../../personal/message/message'
                    })
                that.setData({
                    newMessageNumber: 0,
                    newMessage: false
                })
            },
            fail: console.error
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
      this.getData(this.data.filterIndex,0)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log('onready')
        app.getParam(res => {
            let resData = res.data;
            if (resData.error_code == 0) {
                this.setData({
                    param: resData.data == 2 ? true : false
                })
                app.globalData.param = this.data.param;
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(option) {
        
    },

    /**
     * 显示评论输入框
     */
    showCommentInput: function(e) {
        // console.log('curdataset', e)
        var objid = e.currentTarget.dataset.objid;
        var index = e.currentTarget.dataset.index
        var refCommenter = e.currentTarget.dataset.refcommenter
        var commentType = e.currentTarget.dataset.type
        var commentInfo
        // 帖子类型
        var obj_type = e.currentTarget.dataset.obj_type

        // 根据不同的评论，显示不同评论框的提示
        if (commentType == 'normalcomment') {
            // 正常的评论
            commentInfo = this.data.commentInfo
            commentInfo.title = '请输入评论内容'
            commentInfo.placeholder = '你对这个帖子有啥看法呢？'
            commentInfo.btn = '发布评论'
        } else if (commentType == 'refcomment') {
            commentInfo = this.data.commentInfo
            let title = '回复 @' + refCommenter
            let placeholder = '你想回复 @' + refCommenter + ' 什么呢？'
            let btn = '回复 @' + refCommenter
            commentInfo.title = title
            commentInfo.placeholder = placeholder
            commentInfo.btn = btn
        } else {
            this.hideModal()
        }
        // 显示输入评论
        // this.showModal()
        this.setData({
            commentInfo: commentInfo,
            refCommenter: e.currentTarget.dataset.refcommenter,
            modalName: e.currentTarget.dataset.target,
            dbname: e.currentTarget.dataset.dbname,
            showCommentInput: true,
            objId: objid,
            objIndex: index,
            // 帖子类型
            obj_type: obj_type,
            posteropenid: e.currentTarget.dataset.posteropenid
        });
    },
    // 隐藏评论输入框
    hideModal: function() {
        var commentInfo = {
            title: '',
            placeholder: '',
            btn: ''
        }
        this.setData({
            commentInfo: commentInfo,
            commentContent: '',
            dbname: '',
            posteropenid: '',
            modalName: null,
            showCommentInput: false
        })
    },

    /**
     * 获取评论框的输入内容
     */
    getCommentContent: function(event) {
        let content = event.detail.value;
        this.setData({
            commentContent: ''
        })
        this.setData({
            commentContent: content
        })
    },
    /**
     * 提交评论
     */
    postComment: function(e) {
        var that = this
        wx.showLoading({
            title: '发送中...',
        });
        // 帖子ID
        let objId = this.data.objId;
        let objIndex = this.data.objIndex
        // 评论人
        var nickname = app.globalData.userInfo.nickName
        // 评论内容
        let content = this.data.commentContent;
        // 回复评论人
        let refCommenter = this.data.refCommenter;
        if (!refCommenter) {
            refCommenter = ''
        }
        // 内容为空，中断评论
        if (content == '') {
            wx.showToast({
                title: '请输入内容！',
            })
            wx.hideLoading()
            return false
        }
        // 已有评论
        let posts = this.data.posts

        // 如果objIndex为空，则计算出objIndex
        if (!objIndex) {
            // console.log('objIndex', objIndex)
            for (let i = 0; i < posts.length; i++) {
                // 找到onjIndex,返回index
                if (objId === posts[i].id) {
                    objIndex = i
                    continue;
                }
            }
        }
        // console.log('objIndex', objIndex)

        let comments = posts[objIndex].comments

        // 将当前评论加入到已有评论
        var newcomment = {
            "objId": objId,
            "can_delete": false,
            "ref_comment": {
                "refCommenter": refCommenter
            },
            "commenter": {
                "nickname": nickname
            },
            "content": content
        }
        comments.push(newcomment)

        // 当前评论数
        var newcomment_number = comments.length

        // messagedata
        var mesdata = {
            nickname: nickname,
            avatar: that.data.userInfo.avatarUrl,
            content: '@' + nickname + ' 评论你：' + content,
            messageuser: that.data.posteropenid,
            objId: objId,
            obj_type: that.data.obj_type
        }

        // 调用云函数，提交评论
        const db = wx.cloud.database()
        wx.cloud.callFunction({
            name: 'FrofessComment',
            data: {
                id: objId,
                dbname: that.data.dbname,
                newcomment_number: newcomment_number,
                comments: comments
            },
            success: res => {
                // console.log('评论结果',res)
                // 发送message
                that.message(mesdata)
                // 更新页面信息
                that.setData({
                    posts: posts,
                    commentContent: '',
                    objId: '',
                    obj_type: '',
                    refcommenter: '',
                    modalName: null,
                    showCommentInput: false
                })
                wx.hideLoading()

            },
            fail: err => {
                wx.showModal({
                    title: '加载失败...',
                    content: err,
                })
            }
        })
    },

    // 赞、取消赞
    zan: function(e) {
        // iszan为true,代表已经点赞，可取消赞
        // iszan为false,代表没有点赞，可以点赞
        var iszan = e.currentTarget.dataset.iszan
        // 当前内容的id
        var id = e.currentTarget.dataset.id
        // 当前赞信息
        var index = e.currentTarget.dataset.index
        var zan = this.data.posts[index].praises
        var dbname = e.currentTarget.dataset.dbname
        // 接收的用户openid
        var posteropenid = e.currentTarget.dataset.posteropenid
        // 帖子类型
        var obj_type = e.currentTarget.dataset.obj_type
        // 修改赞状态
        this.changezan(id, zan, dbname, index, iszan, posteropenid, obj_type)
    },

    changezan: function(id, zan, dbname, index, iszan, posteropenid, obj_type) {
        var that = this
        var content
        // iszan == true 已赞，可以取消赞
        if (iszan === 'true') {
            // console.log('zan1', zan)
            var userInfo = wx.getStorageSync('userInfo')
            var ownernickname = userInfo.nickName
            // 删除已赞
            for (let i = 0; i < zan.length; i++) {
                if (ownernickname == zan[i].nickname) {
                    zan.splice(i, 1);
                    // console.log('zan1',zan)
                }
            }
            // 更新点赞数
            var newpraise_number = zan.length
            // console.log(newpraise_number)
            iszan = false
            //messagedata
            content = '@' + that.data.userInfo.nickName + ' 取消了赞!'
            // console.log('zan2',zan)
        } else {
            // iszan == false 未赞，可以赞
            var item = {
                "id": id,
                "nickname": that.data.userInfo.nickName,
                "avatar": that.data.userInfo.avatarUrl
            }
            // 添加赞
            zan.push(item)
            // console.log('zan', zan)
            // 更新点赞数
            var newpraise_number = zan.length
            // console.log(newpraise_number)
            //messagedata
            content = '@' + that.data.userInfo.nickName + ' 给你点赞了!'
        }

        // messagedata
        var mesdata = {
            nickname: that.data.userInfo.nickName,
            avatar: that.data.userInfo.avatarUrl,
            content: content,
            messageuser: posteropenid,
            objId: id,
            obj_type: obj_type
        }

        // 调用云函数,点赞
        wx.cloud.callFunction({
            name: 'FrofessZan',
            data: {
                id: id,
                dbname: dbname,
                newpraise_number: newpraise_number,
                zan: zan
            },
            success: res => {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                // console.log('praise', res)

                // 发送message
                that.message(mesdata)

                // 修改本地显示
                var posts = that.data.posts
                posts[index].praises = zan
                posts[index].haszan = iszan
                that.setData({
                    posts: posts
                })
            },
            fail: err => {
                wx.showModal({
                    title: '加载失败...',
                    content: err,
                })
            }
        })
    },
    /**
     * 上拉加载更多
     */
    onReachBottom: function() {
        let page = this.data.dataList.length
        this.getData(this.data.filterIndex,page)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },
    /** 
     * 进入发表页面
     */
    post: function(e) {
        let page = e.currentTarget.dataset.page
        console.log(e)
        wx.navigateTo({
            url: page
        })
    },

    /**
     * 预览图片
     */
    previewImage: function(event) {
        let url = event.target.id;
        wx.previewImage({
            current: '',
            urls: [url]
        })
    },

    /**
     * 预览图片
     */
    previewMoreImage: function(event) {
        let images = event.currentTarget.dataset.obj.map(item => {
            return this.data.baseImageUrl + item;
        });
        let url = event.target.id;
        wx.previewImage({
            current: url,
            urls: images
        })
    },
    // 话题详情
    topicdetial: function(e) {
        var id = e.currentTarget.dataset.id
        var view_number = this.data.topic.view_number + 1
        // 更改view_number
        wx.cloud.callFunction({
            name:'ViewNumber',
            data:{
                id:id,
                dbname:'topics',
                view_number: view_number
            },
            success:res=>{
                wx.navigateTo({
                    url: '../topic_detail/topic_detail?id=' + id,
                })
            },
            fail:console.log
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        console.log('onhidden')
        clearInterval(this.data.messagefunc)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        console.log('onunload')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})