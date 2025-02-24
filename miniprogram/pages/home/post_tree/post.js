const app = getApp()
const db = wx.cloud.database()
const _ = db.command
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
    homeworkPosition:'',
    homeworkFrontContent:'',
    homeworkEndContent:''
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
      this.setData({
        userInfo : res.data[0]
      })
      db.collection("treeInfo").where({
        userId:res.data[0]._id
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
      if(syncToHomework){
        let homeworkTags=[]
        tags.forEach((item,index)=>{
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
          postTree:'handInHomework',
          frontContent:this.data.treeContent,
          homeworkTags:info
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
    info.create_time=wx.cloud.database().serverDate()
    info.userId=this.data.userInfo._id
    info.treeId=this.data.selectedTree._id
    info.position=this.data.homeworkPosition
    info.frontContent=this.data.homeworkFrontContent
    info.endContent=this.data.homeworkEndContent
    info.details=this.data.homeworkTags
    console.log(info)
    for(let item of info.details){
      let filesID = [];
      if(item.files.length!==0){
        item.files.forEach((iten,indey)=>{
          let extName = iten.split(".").pop(); // 获取拓展名  
          let cloudPath = "homework/" + new Date().getTime() + indey + '.' + extName;
          let promise = wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: iten, // 文件路径
          })
          filesID.push(promise)
        })
        filesID = await Promise.all(filesID)
        item.files = filesID
      }
    }
    console.log(info)
    db.collection("homeworkInfo")
    .add({
      data:info
    }).then(res=>{
      console.log(res)
      wx.switchTab({
        url: '/pages/home/index/index'
      })
    })
  }
});