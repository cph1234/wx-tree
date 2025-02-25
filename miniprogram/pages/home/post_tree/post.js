const app = getApp()
const db = wx.cloud.database()
const _ = db.command

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
    homeworkTime:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    this.getData()
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
    wx.chooseImage({
      count: 9 - this.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let tags = this.data.tags
        tags.forEach(iten => {
          if (iten.type === item.type) {
            iten.imgUrl = res.tempFilePaths[0];
          }
        });
        this.setData({
          tags:tags
        })
      }
    });
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
    info.create_time=this.data.homeworkTime
    info.userId=this.data.userInfo._id
    info.treeId=this.data.selectedTree._id
    info.position=this.data.city
    info.frontContent=this.data.homeworkFrontContent
    info.endContent=this.data.homeworkEndContent
    info.details=this.data.homeworkTags
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
          draft:emptyInfo
        }
      }).then(res=>{
        console.log(res)
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
  }
});