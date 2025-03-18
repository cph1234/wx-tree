// const config = require("./config.js");
const config = require("config.js");

App({
    globalData: {
        appId: null,
        userInfo: null,
        apiUrl: null,
        color: '0aecc3',
        imageUrl: 'http://image.kucaroom.com/',
        bgImage: 'http://image.kucaroom.com/',
        changeSchoolPost: false,
        changeSchoolSale: false,
        changeSchoolMatch: false,
        postHelp: false,
        reloadSale: false,
        reloadHome: false,
        param: false,
        // 是否从posttopic跳转
        isposttopic:false,
        user_openid:'',
        jsonData:[],
        showTabbar:true
    },
    onLaunch: async function() {
        // 初始化云环境
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: config.CLOUNDID,
                traceUser: true,
            })
        }
        //调用云函数
        console.log('here')
        wx.cloud.callFunction({
          name: 'login',
          success: res => {
            //获取用户openid
            console.log(res)
            this.globalData.user_openid = res.result.openid
          }
        })

        //读取节气
        let year = new Date().getFullYear();
        let path = 'cloud://dev-9gwar4qf4378940c.6465-dev-9gwar4qf4378940c-1342595866/date_json/year.json'
        let currentTempFilePath = await wx.cloud.downloadFile({
          fileID: path.replace('year',year),
        })
        let preTempFilePath = await wx.cloud.downloadFile({
          fileID: path.replace('year',year-1),
        })
        let nextTempFilePath = await wx.cloud.downloadFile({
          fileID: path.replace('year',year+1),
        })
        let current = await this.readJSONFile(currentTempFilePath.tempFilePath); // 读取文件内容
        let pre = await this.readJSONFile(preTempFilePath.tempFilePath); // 读取文件内容
        let next = await this.readJSONFile(nextTempFilePath.tempFilePath); // 读取文件内容
        let jsonData = JSON.parse(JSON.parse(pre)).concat(JSON.parse(JSON.parse(current)), JSON.parse(JSON.parse(next)));
        this.globalData.jsonData = jsonData
    },
    async readJSONFile(tempFilePath) {
      return new Promise((resolve, reject) => {
        const fs = wx.getFileSystemManager();
        fs.readFile({
          filePath: tempFilePath,
          encoding: 'utf8', // 指定编码格式，如 'utf8' 或 'binary'
          success: (res) => resolve(res.data),
          fail: (err) => reject(err),
        });
      });
    },
    // 获取当前时间
    getnowtime: function() {
        var date = new Date
        var year = date.getFullYear().toString()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        if (hour.toString().length === 1) {
            hour = '0' + hour.toString()
        } else if (minute.toString().length === 1) {
            minute = '0' + minute.toString()
        } else if (second.toString().length === 1) {
            second = '0' + second.toString()
        }

        var nowtime = year + '/' + month.toString() + '/' + day.toString() + ' ' + hour + ":" + minute + ":" + second
        return nowtime
    },

    // 创建新的消息盒子
    message: function (data) {
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
        // 更新消息
        const db = wx.cloud.database()
        db.collection('message').add({
            data: {
                "from_user": {
                    "avatar": avatar,
                    "nickname": nickname
                },
                "created_at": updatetime,
                "content": '@' + nickname + ' 评论你：' + content,
                "isread": false,
                "messageuser": messageuser,
                "objId": objId

            },
            success(res) {
                // console.log('messageres',res)
            },
            fail: console.log
        })
    },
   
    /**
     * 获取新的消息盒子
     */
    getNewInbox: function(type, callback) {

    },
    /**
     * 获取新的消息盒子
     */
    getParam: function(callback) {}
})