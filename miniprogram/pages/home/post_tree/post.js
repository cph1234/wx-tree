const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const {
  wxml,
  style
 } = require('../../../utils/generateImg.js')
let QQMapWX = require('./qqmap-wx-jssdk.js');
let qqmapsdk = new QQMapWX({
  key: 'UGDBZ-Z3SWW-RHER7-3PAQH-4Y5CH-BEBUJ' // 必填，填自己在腾讯位置服务申请的key
});

Page({
  data: {
    userInfo:{},
    trees: [],
    treesInfo:[],
    selectedTree: {},
    wordCount: 0,
    tags: [
      {type:'周边环境',imgUrl:''},
      {type:'整株树形',imgUrl:''},
      {type:'根茎',imgUrl:''},
      {type:'树叶',imgUrl:''},
      {type:'花（含孢子）',imgUrl:''},
      {type:'果（含种子）',imgUrl:''},
      {type:'树栖动物',imgUrl:''},
      {type:'树生植物',imgUrl:''},
      {type:'病虫害',imgUrl:''},
      {type:'特殊性状',imgUrl:''},
      {type:'人文资料',imgUrl:''},
      {type:'其它',imgUrl:''},
    ],
    selectedTags: [],
    images: [],
    syncToHomework: false,
    currentPage: 'postTree',
    treeContent:'',
    homeworkTags:[
      {type:'周边环境',files:[],text:''},
      {type:'整株树形',files:[],text:''},
      {type:'根茎',files:[],text:''},
      {type:'树叶',files:[],text:''},
      {type:'花（含孢子）',files:[],text:''},
      {type:'果（含种子）',files:[],text:''},
      {type:'树栖动物',files:[],text:''},
      {type:'树生植物',files:[],text:''},
      {type:'病虫害',files:[],text:''},
      {type:'特殊性状',files:[],text:''},
      {type:'人文资料',files:[],text:''},
      {type:'其它',files:[],text:''}
    ],
    homeworkTitle:'',
    homeworkFrontContent:'',
    homeworkEndContent:'',
    latitude: null,
    longitude: null,
    city: '获取位置',
    homeworkTime:'',
    canPublish:true,
    treePublish:true,
    reason:'',
    jieqi:{},
    index:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.getData()
    this.getDate()
    var that = this;
    // this.widget = this.selectComponent('.widget');
    setTimeout(function(){
      that.widget = that.selectComponent('.widget');
      },1000)
  },
  getData(){
    db.collection("userInfo").where({
      _openid:app.globalData.user_openid
    }).get().then(res=>{
      let userInfo = res.data[0]
      this.setData({
        userInfo : userInfo
      })
      db.collection("treeInfo").where({
        userId:userInfo._id
      }).get().then(res=>{
        if(res.data.length==0){
          wx.showToast({
            title: '未登记树木信息，请先登记！',
            icon: 'error'
          })
        }
        let trees = []
        res.data.forEach(item=>{
          trees.push(item.treeType)
        })
        this.setData({
          treesInfo: res.data,
          trees: trees
        })
        if(userInfo.draft!==null&&userInfo.draft!==undefined&&userInfo.draft.userId!==''){
          let draft = userInfo.draft
          let treeId = draft.treeId
          let selectedTree = {}
          res.data.forEach(item=>{
            if(item._id===treeId){
              selectedTree = item
            }
          })
          this.setData({
            homeworkTitle:draft.title,
            homeworkTime:draft.create_time,
            city:draft.position,
            homeworkFrontContent:draft.frontContent,
            homeworkEndContent:draft.endContent,
            homeworkTags:draft.details,
            selectedTree:selectedTree
          })
        }
      })
    })
  },
  switchTab(e) {
    const page = e.currentTarget.dataset.page;
    console.log('[Debug] Received page:', page);
    this.setData({ currentPage: page });
  },

  bindTreeChange(e) {
    this.setData({
      index: e.detail.value,
      selectedTree: this.data.treesInfo[e.detail.value]
    })
    if(this.data.canPublish){
      db.collection("treeInfo")
      .doc(this.data.selectedTree._id)
      .get().then(res=>{
        const hasElement = res.data.homework.some(item => item.name === this.data.jieqi.name && item.year === this.data.jieqi.time.split('/')[0]);
        console.log(hasElement)
        if(hasElement){
          this.setData({
            reason:"该节气作业已发布",
            treePublish:false
          })
        }else{
          this.setData({
            treePublish:true
          })
        }
      })
    }
  },

  bindTextAreaInput(e) {
    this.setData({
      wordCount: e.detail.value.length,
      treeContent: e.detail.value
    });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const index = this.data.selectedTags.indexOf(tag);
    if (index > -1) {
      this.data.selectedTags.splice(index, 1);
    } else {
      if (this.data.selectedTags.length >= 9) {
        wx.showToast({ title: '最多选择9个标签', icon: 'none' });
        return;
      }
      this.data.selectedTags.push(tag);
    }
    this.setData({ selectedTags: this.data.selectedTags });
  },

  chooseImage(e) {
    let item = e.currentTarget.dataset.item
    const validUrls = this.data.tags.filter(item => item.imgUrl);
    const count = validUrls.length;
    if(count>=9){
      wx.showToast({
        title: '最多选择9张图片',
        icon: 'warning'
      });
    }else{
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          let tags = this.data.tags
          tags.forEach(iten => {
            if (iten.type === item.type) {
              iten.imgUrl = res.tempFilePaths[0];
            }
          });
          console.log(tags)
          this.setData({
            tags:tags
          })
        }
      });
    }

  },
  async publishCircle(){
    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const day = String(currentDate.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
    let info={}
    info.comment=[]
    info.content=this.data.treeContent
    info.create_time=wx.cloud.database().serverDate()
    info.userId=this.data.userInfo._id
    info.treeId=this.data.selectedTree._id
    info.treeType = this.data.selectedTree.treeType
    info.fileIds=[]
    info.likes=0
    this.data.tags.forEach(iten => {
      if (iten.imgUrl !== "") {
        info.fileIds.push(iten.imgUrl)
      }
    });
    console.log(info)
    let filesID = [];
    info.fileIds.forEach((item, index) => {
      let extName = item.split(".").pop(); // 获取拓展名  
      let cloudPath = "tree/" + new Date().getTime() + index + '.' + extName;
      let promise = wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: item, // 文件路径
      })
      filesID.push(promise)
    })
    filesID = await Promise.all(filesID)
    console.log(filesID)
    info.fileIds=[]
    filesID.forEach(item=>{
      info.fileIds.push(item.fileID)
    })
    db.collection("treeFriendsCircleInfo")
    .add({
      data:info
    }).then(res=>{
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      db.collection("userInfo")
      .doc(this.data.userInfo._id)
      .update({
        data: {
          // 如果存在 year，则 count +1
          tree_circle_count: _.inc(1) ,
        }
      })
      // todo
      if(this.data.syncToHomework){
        let homeworkTags=[]
        this.data.tags.forEach((item,index)=>{
          let info = {}
          info.type=item.type
          info.files=[]
          if(item.imgUrl!==""){
            info.files.push(item.imgUrl)
          }
          info.text=''
          homeworkTags.push(info)
        })
        this.setData({
          currentPage:'handInHomework',
          frontContent:this.data.treeContent,
          homeworkTags:homeworkTags
        })
      }else{
        app.globalData.refresh = true
        this.resetData()
        wx.switchTab({
          url: '/pages/home/index/index'
        })
      }
    })
  },
  previewHomeworkImage: function(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的链接
      urls: e.currentTarget.dataset.urls // 需要预览的图片链接列表（此处仅为示例，实际应用中可能有多个链接）
    });
  },
  homeworkTime(e){
    this.setData({
      homeworkTime:e.detail.value
    })
  },
  addImage(e){
    let type = e.currentTarget.dataset.type
    let flag = true
    this.data.homeworkTags.forEach(item => {
      if (type === item.type) {
        if(item.files.length>=3){
          flag = false
        }
      }
    });
    if(!flag){
      wx.showToast({
        title: '最多选择3张图片',
        icon: 'warning'
      });
    }else{
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          let tags = this.data.homeworkTags
          tags.forEach(item => {
            if (type === item.type) {
              item.files.push(res.tempFilePaths[0])
            }
          });
          this.setData({
            homeworkTags:tags
          })
          console.log(tags)
        }
      });
    }
  },
  inputText(e){
    console.log(e)
    let tags = this.data.homeworkTags
    tags.forEach(item => {
      if (e.currentTarget.dataset.type === item.type) {
        item.text = e.detail.value
      }
    });
    this.setData({
      homeworkTags:tags
    })
  },
  inputFrontContent(e){
    this.setData({
      homeworkFrontContent:e.detail.value
    })
  },
  inputEndContent(e){
    this.setData({
      homeworkEndContent:e.detail.value
    })
  },
  homeworkText(e){
    this.setData({
      homeworkTitle:e.detail.value
    })
  },
  previewImage(e) {
    wx.previewImage({
      current: this.data.images[e.currentTarget.dataset.index],
      urls: this.data.images
    });
  },

  toggleSync() {
    this.setData({ syncToHomework: !this.data.syncToHomework });
  },

  async handlePublish() {
    // 处理发布逻辑
    let info={}
    info.title=this.data.homeworkTitle
    info.create_time=wx.cloud.database().serverDate()
    info.userId=this.data.userInfo._id
    info.treeId=this.data.selectedTree._id
    info.treeType=this.data.selectedTree.treeType
    info.position=this.data.city
    info.frontContent=this.data.homeworkFrontContent
    info.endContent=this.data.homeworkEndContent
    info.details=this.data.homeworkTags
    info.homeworkTime=this.data.homeworkTime
    console.log(info)
    for(let item of info.details){
      let filesID = [];
      if(item.files.length!==0){
        let img=[]
        item.files.forEach((iten,indey)=>{
          console.log(iten)
          if(iten.startsWith("cloud://")){
            img.push(iten)
          }else{
            let extName = iten.split(".").pop(); // 获取拓展名  
            let cloudPath = "homework/" + new Date().getTime() + indey + '.' + extName;
            let promise = wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: iten, // 文件路径
            })
            filesID.push(promise)
          }
        })
        filesID = await Promise.all(filesID)
        let fileIDs = []
        filesID.forEach(item=>{
          fileIDs.push(item.fileID)
        })
        img.forEach(item=>{
          fileIDs.push(item)
        })
        item.files = fileIDs
      }
    }
    db.collection("homeworkInfo")
    .add({
      data:info
    }).then(res=>{
      let treeInfo={}
      treeInfo.name = this.data.jieqi.name
      treeInfo.year = this.data.jieqi.time.split('/')[0]
      db.collection("treeInfo")
      .doc(this.data.selectedTree._id)
      .update({
        data:{
          homework:_.push(treeInfo)
        }
      })
      let emptyInfo={}
      emptyInfo.title=''
      emptyInfo.create_time=''
      emptyInfo.userId=''
      emptyInfo.treeId=''
      emptyInfo.position=''
      emptyInfo.frontContent=''
      emptyInfo.endContent=''
      emptyInfo.details=[]
      db.collection("userInfo")
      .doc(this.data.userInfo._id)
      .update({
        data:{
          draft:emptyInfo,
          tree_circle_count: _.inc(1) ,
        }
      }).then(res=>{
        db.collection("treeInfo")
          .doc(this.data.selectedTree._id)
          .get().then(res=>{
            const currentYear = new Date().getFullYear();
            const count = res.data.homework.filter(item => item.year === currentYear).length;
            if(count==24){
              db.collection("userInfo")
                .doc(this.data.userInfo._id)
                .update({
                  data:{
                    medal_count: _.inc(1) ,
                  }
                })
            }
          })
        console.log(res)
        app.globalData.refresh = true
        this.resetData()
        wx.switchTab({
          url: '/pages/home/index/index'
        })
      })
    })
  },
  async handleDraft(){
    // 处理发布逻辑
    let info={}
    info.title=this.data.homeworkTitle
    info.create_time=this.data.homeworkTime
    info.userId=this.data.userInfo._id
    info.treeId=this.data.selectedTree._id
    info.position=this.data.city
    info.frontContent=this.data.homeworkFrontContent
    info.endContent=this.data.homeworkEndContent
    info.details=this.data.homeworkTags
    for(let item of info.details){
      let filesID = [];
      if(item.files.length!==0){
        let img=[]
        item.files.forEach((iten,indey)=>{
          console.log(iten)
          if(iten.startsWith("cloud://")){
            img.push(iten)
          }else{
            let extName = iten.split(".").pop(); // 获取拓展名  
            let cloudPath = "homework/" + new Date().getTime() + indey + '.' + extName;
            let promise = wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: iten, // 文件路径
            })
            filesID.push(promise)
          }
        })
        filesID = await Promise.all(filesID)
        let fileIDs = []
        filesID.forEach(item=>{
          fileIDs.push(item.fileID)
        })
        img.forEach(item=>{
          fileIDs.push(item)
        })
        item.files = fileIDs
      }
    }
    console.log(info)
    db.collection("userInfo")
    .doc(this.data.userInfo._id)
    .update({
      data:{
        draft:info
      }
    }).then(res=>{
      console.log(res)
      app.globalData.refresh = true
      this.resetData()
      wx.switchTab({
        url: '/pages/home/index/index'
      })
    })
  },
  getLocation() {
    let that=this
    wx.getLocation({
      type: 'wgs84',
      success :res=> {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        
        //新增
        qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数 
          //Object格式
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {//成功后的回调
            console.log(res.result.ad_info.city);
            that.setData({
              city: res.result.ad_info.city + '('+longitude.toString().split('.')[0]+'°,'+latitude.toString().split('.')[0]+'°)'
            })
            },
          fail: function(error) {
            console.error(error);
          },
          complete: function(res) {
            console.log(res);
          }
          })
      },
      fail: function (errInfo) {
        console.info(errInfo)
      }
     })
  },
  async getDate(){
    let jsonData = app.globalData.jsonData;
    const currentTime = this.getCurrentTime();
    let nextJieqi;
    let preJieqi;
    for (const index in jsonData) {
      if (new Date(jsonData[index].time.replace(/-/g,'/')) > new Date(currentTime)) {
        nextJieqi = jsonData[index]
        nextJieqi.time = nextJieqi.time.replace(/-/g,'/')
        preJieqi = jsonData[index-1]
        preJieqi.time = preJieqi.time.replace(/-/g,'/')
        break;
      }
    }
    let timeDiffInDays = null;
    const prevTime = new Date(preJieqi.time);
    prevTime.setHours(0, 0, 0, 0); // 忽略时间部分
    timeDiffInDays = Math.floor((new Date() - prevTime) / (1000 * 60 * 60 * 24)); // 转换为天数
    // 判断时间差是否在三天内
    let result = null;
    if (timeDiffInDays !== null && timeDiffInDays <= 3) {
      result = preJieqi;
    } else {
      result = nextJieqi;
    }
    let time = result.time.split(" ")[0]
    console.log(result)
    result.time = new Date(result.time).setHours(0, 0, 0, 0)
    timeDiffInDays = Math.floor((new Date().setHours(0, 0, 0, 0) - result.time) / (1000 * 60 * 60 * 24));
    let flag = Math.abs(timeDiffInDays) <= 3;
    result.time = time
    console.log(flag)
    if(!flag){
      let reason = "当前时间距离"+result.name+"还有"+Math.abs(timeDiffInDays)+"天"
      this.setData({
        jieqi:result,
        reason:reason,
        canPublish:flag
      })
    }else{
      this.setData({
        jieqi:result,
        canPublish:flag
      })
    }
  },
  getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  resetData() {
    this.setData({
      userInfo:{},
      treesInfo:[],
      selectedTree: {},
      wordCount: 0,
      tags: [
        {type:'周边环境',imgUrl:''},
        {type:'整株树形',imgUrl:''},
        {type:'根茎',imgUrl:''},
        {type:'树叶',imgUrl:''},
        {type:'花（含孢子）',imgUrl:''},
        {type:'果（含种子）',imgUrl:''},
        {type:'树栖动物',imgUrl:''},
        {type:'树生植物',imgUrl:''},
        {type:'病虫害',imgUrl:''},
        {type:'特殊性状',imgUrl:''},
        {type:'人文资料',imgUrl:''},
        {type:'其它',imgUrl:''},
      ],
      selectedTags: [],
      images: [],
      syncToHomework: false,
      currentPage: 'postTree',
      treeContent:'',
      homeworkTags:[
        {type:'周边环境',files:[],text:''},
        {type:'整株树形',files:[],text:''},
        {type:'根茎',files:[],text:''},
        {type:'树叶',files:[],text:''},
        {type:'花（含孢子）',files:[],text:''},
        {type:'果（含种子）',files:[],text:''},
        {type:'树栖动物',files:[],text:''},
        {type:'树生植物',files:[],text:''},
        {type:'病虫害',files:[],text:''},
        {type:'特殊性状',files:[],text:''},
        {type:'人文资料',files:[],text:''},
        {type:'其它',files:[],text:''}
      ],
      homeworkTitle:'',
      homeworkFrontContent:'',
      homeworkEndContent:'',
      latitude: null,
      longitude: null,
      city: '获取位置',
      homeworkTime:'',
      canPublish:true,
      reason:'',
      jieqi:{}
    });
  },
  onShow: function(option) {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        currentIndex: 1 // 控制哪一项是选中状态
      })
    }
  },

  //生成长图
  generateImage: function() {
    const that = this;
    // wx.showLoading({
    //   title: '生成中...',
    //   mask: true
    // });
    // 配置wxml-to-canvas
    this.widget = this.selectComponent('.widget');
    setTimeout(function(){
      const p1 = that.widget.renderToCanvas({
        wxml: wxml(that.data.selectedTree), // 生成需要渲染的wxml
        style // 生成样式
      });
  
      p1.then(() => {
        const p2 = that.widget.canvasToTempFilePath()
        p2.then(res => {
          const cloudPath = `preview/${Date.now()}_${that.data.userInfo._id}.png`;
          // 上传云存储
          wx.cloud.uploadFile({
            cloudPath,
            filePath: res.tempFilePath,
            success: res => {
              wx.hideLoading();
              wx.previewImage({
                current: res.tempFilePath,
                urls: [res.tempFilePath]
              });
              console.log('云存储成功', res.fileID);
            },
            fail: err => {
              wx.hideLoading();
              console.error('上传失败', err);
            }
          });
        }).catch(fail => {
            wx.hideLoading();
            wx.showToast({
                icon: 'error',
                title: '请稍后再试',
            })
        })


        that.widget.canvasToTempFilePath({
          fileType: 'png',
          quality: 1,
          success: res => {
            console.log(res)
            const tempFilePath = res.tempFilePath;
            const cloudPath = `preview/${Date.now()}_${that.data.userInfo._id}.png`;
  
            // 上传云存储
            wx.cloud.uploadFile({
              cloudPath,
              filePath: tempFilePath,
              success: res => {
                wx.hideLoading();
                wx.previewImage({
                  current: tempFilePath,
                  urls: [tempFilePath]
                });
                console.log('云存储成功', res.fileID);
              },
              fail: err => {
                wx.hideLoading();
                console.error('上传失败', err);
              }
            });
          },
          fail: err => {
            wx.hideLoading();
            console.error('生成失败', err);
          }
        });
      });
    },1000)
  },

  // 生成需要渲染的wxml结构
  createWxml: function() {
    return `
      <view class="container">
        <!-- 原页面结构需要在此复现 -->
        ${document.querySelector('.container').innerHTML}
      </view>
    `;
  },

  // 生成样式表
  createStyle: function() {
    return {
      container: {
        width: '750rpx',
        overflow: 'hidden',
        backgroundColor: '#ffffff'
      },
      // 需要补充所有页面元素的样式
      'section': { margin: '20rpx' },
      'info-box': { padding: '20rpx' },
      // ...其他样式规则...
    }
  },
});