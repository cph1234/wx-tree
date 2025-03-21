const wxml = (selectedTree)=>{
  return `
  <view class="container">
  <view>
  <!-- 作业信息  -->
  <view class="homework-info">
    <!-- 题目输入 -->
    <input 
      name="title" 
      class="input-title" 
      placeholder="请输入题目" 
      placeholder-class="placeholder-title"
      bindblur="homeworkText"
      value="{{homeworkTitle}}"
    />
    <!-- 作者输入 -->
    <view class="form-item">
      <text class="author-label">作者：</text>
      <text 
        name="author" 
        class="input" 
        placeholder="输入作者昵称" 
        placeholder-class="placeholder-other"
      >{{userInfo.name}}</text>
    </view>

    <!-- 所在位置 -->
    <view class="form-item">
      <text class="author-label">所在位置：</text>
      <view bindtap="getLocation">
        <image src="/image/定位.png" class="icon"></image>
        <text>{{city}}</text>
      </view>
    </view>

    <!-- 作业时间 -->
    <view class="form-item">
      <text class="author-label">作业时间：</text>
      <input 
        name="author" 
        class="input" 
        placeholder="输入作业时间(备注节气)" 
        placeholder-class="placeholder-other"
        value="{{homeworkTime}}"
        bindblur="homeworkTime"
      />
    </view>

  </view>

  <!-- 前言  -->
  <textarea
    name="intro" 
    class="input-intro" 
    placeholder="前言" 
    placeholder-class="placeholder-intro"
    bindblur="inputFrontContent"
    value="{{homeworkFrontContent}}"
  ></textarea>

  <!-- 描述分析区域  -->
  <view>
    <!-- 周边环境  -->
    <view wx:for="{{homeworkTags}}" wx:key="index">
      <view class="description">
        <view class="d-info">
            <text class="d-title">{{item.type}}</text>
            <text class="d-note">*最多可传3张图</text>
            <image src="/image/add-photo.png" class="add-photo"></image>
            <text class="add-text" bindtap="addImage" data-type="{{item.type}}">添加</text>
        </view>
        <view class="grid-container">
          <block wx:for="{{item.files}}" wx:for-item="imageItem" wx:key="index">
            <view class="grid-item">
              <image class="grid-item-img" src="{{imageItem}}" mode="aspectFill" bindtap="previewHomeworkImage"  data-url="{{imageItem}}" data-urls="{{item.files}}"></image>
            </view>
          </block>
          <!-- 占位view，用于在图片数量不足时实现布局自适应 -->
          <view class="grid-item" wx:if="{{item.fileIds.length % 3 === 1 || item.fileIds.length % 3 === 2}}"></view>
          <view class="grid-item" wx:if="{{item.fileIds.length % 3 === 1}}"></view>
        </view>
        <textarea
          name="intro" 
          class="input-desp" 
          placeholder="请输入文字描述" 
          placeholder-class="placeholder-intro"
          bindblur="inputText"
          data-type="{{item.type}}"
          value="{{item.text}}"
        ></textarea>
      </view>
    </view>
  </view>

  <!-- 结语  -->
  <textarea
      name="intro" 
      class="input-intro" 
      placeholder="结语" 
      placeholder-class="placeholder-intro"
      bindblur="inputEndContent"
      value="{{homeworkEndContent}}"
  ></textarea>
</view>    
  </view>
  `
 }
 
const style = {
  container: {
    padding: '20rpx',
    backgroundColor: '#FFFFFF',
    marginBottom: '160rpx'
  },
  section: {
    marginBottom: '10rpx',
    padding: '10rpx',
    display: 'flex',
    flexDirection: 'column'
  },
  picker: {
    padding: '20rpx',
    backgroundColor: '#F6DB74',
    width: '690rpx',
    height: '84rpx',
    borderRadius: '38rpx',
    textAlign: 'center',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '30rpx',
    color: '#444243'
  },
  infoBox: {
    marginTop: '20rpx',
    marginLeft: '20rpx',
    marginRight: '20rpx'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5rpx 0'
  },
  'infoRow.single-line': {
    borderBottom: 'none',
    padding: 0
  },
  infoItem: {
    flex: 1,
    padding: '12rpx 20rpx',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  'infoItem.full-width': {
    width: '100%'
  },
  label: {
    color: '#898781',
    fontSize: '26rpx',
    paddingRight: '10rpx'
  },
  value: {
    color: '#1E0417',
    fontWeight: 500,
    fontSize: '26rpx',
    paddingRight: '10rpx'
  },
  customBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '40rpx 0',
    backgroundColor: '#F2F3F5',
    borderRadius: '28rpx',
    width: '100%'
  },
  btnContainer: {
    position: 'relative',
    width: '320rpx',
    height: '80rpx',
    borderRadius: '30rpx'
  },
  btnBg: {
    width: '100%',
    height: '100%'
  },
  largeBtnBg: {
    width: '100%',
    height: '100rpx'
  },
  btnTextActive: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '32rpx',
    fontWeight: 600
  },
  btnText: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '32rpx',
    color: '#898781'
  },
  textarea: {
    width: '100%',
    height: '200rpx',
    padding: '20rpx',
    borderRadius: '8rpx'
  },
  wordCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: '24rpx',
    marginTop: '10rpx',
    marginBottom: '10rpx'
  },
  addBtn: {
    width: '162rpx',
    height: '162rpx',
    border: '2rpx dashed #ddd',
    borderRadius: '8rpx',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25rpx',
    color: '#999'
  },
  uploadBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10rpx'
  },
  noteWord: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '24rpx',
    color: '#898781',
    lineHeight: '24rpx',
    textAlign: 'left'
  },
  syncWord: {
    marginLeft: '10rpx',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '26rpx',
    color: '#1E0417',
    textAlign: 'left'
  },
  syncOption: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20rpx',
    color: '#666'
  },
  publishBtn: {
    backgroundColor: '#1E0417',
    textAlign: 'center',
    padding: '30rpx',
    borderRadius: '50rpx',
    width: '690rpx',
    margin: '40rpx 0',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '30rpx',
    color: '#F2F3F5'
  },
  workNote1: {
    width: '520rpx',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '24rpx',
    color: '#898781',
    textAlign: 'left',
    right: '0'
  },
  homeworkInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputTitle: {
    height: '60rpx',
    textAlign: 'left',
    paddingBottom: '10rpx',
    borderBottomWidth: '2rpx',
    borderBottomStyle: 'solid',
    borderBottomColor: '#F2F3F5',
    marginBottom: '10rpx'
  },
  inputIntro: {
    width: '100%',
    height: '146rpx',
    backgroundColor: '#F2F3F5',
    borderRadius: '20rpx',
    verticalAlign: 'top',
    padding: '15rpx',
    marginBottom: '20rpx'
  },
  inputDesp: {
    width: '100%',
    height: '146rpx',
    borderRadius: '20rpx',
    verticalAlign: 'top',
    padding: '15rpx',
    marginBottom: '20rpx',
    borderWidth: '2rpx',
    borderStyle: 'solid',
    borderColor: '#E6E9EE'
  },
  placeholderTitle: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '36rpx',
    color: '#C9CCD3'
  },
  placeholderIntro: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '26rpx',
    color: '#898781',
    lineHeight: '42rpx'
  },
  placeholderOther: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '26rpx',
    color: '#C6C8CE',
    lineHeight: '26rpx',
    textAlign: 'right'
  },
  addPhoto: {
    width: '28rpx',
    height: '28rpx',
    marginLeft: 'auto',
    marginRight: '5rpx'
  },
  addText: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '28rpx',
    color: '#898781'
  },
  photoBig: {
    width: '100%',
    marginTop: '10rpx',
    marginBottom: '10rpx',
    borderRadius: '20rpx'
  },
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10rpx',
    backgroundColor: '#fff',
    borderRadius: '16rpx'
  },
  authorLabel: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '26rpx',
    color: '#898781',
    lineHeight: '26rpx',
    textAlign: 'right'
  },
  textarea: {
    width: '100%',
    height: '200rpx',
    padding: '20rpx',
    borderRadius: '8rpx'
  },
  wordCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: '24rpx',
    margin: '10rpx 0'
  },
  description: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10rpx'
  },
  dInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dTitle: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 700,
    fontSize: '28rpx',
    color: '#1E0417',
    marginRight: '15rpx'
  },
  icon: {
    width: '36rpx',
    height: '36rpx',
    marginRight: '8rpx'
  },
  dNote: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '22rpx',
    color: '#898781'
  },
  uploadSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '0 10rpx',
    width: '100%'
  },
  uploadItem: {
    width: 'calc((100% - 12rpx) / 4)',
    marginBottom: '5rpx',
    height: 'auto',
    minHeight: '166rpx'
  },
  addBtn: {
    width: '100%',
    height: '162rpx',
    border: '2rpx dashed #ddd',
    borderRadius: '8rpx',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25rpx',
    color: '#999',
    flexDirection: 'column'
  },
  uploadBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10rpx'
  },
  noteWord: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '24rpx',
    color: '#898781',
    lineHeight: '24rpx'
  },
  syncWord: {
    marginLeft: '10rpx',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '26rpx',
    color: '#1E0417',
    textAlign: 'left'
  },
  syncOption: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20rpx',
    color: '#666'
  },
  addHwArea: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  btnArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '30rpx'
  },
  btnImage: {
    height: '72rpx',
    width: '72rpx'
  },
  textOther: {
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 400,
    fontSize: '22rpx',
    color: '#898781',
    textAlign: 'right'
  },
  publishBtn2: {
    backgroundColor: '#1E0417',
    textAlign: 'center',
    padding: '30rpx',
    borderRadius: '50rpx',
    width: '400rpx',
    margin: '40rpx 0',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '30rpx',
    color: '#F2F3F5',
    marginLeft: 'auto'
  },
  publishBtn3: {
    backgroundColor: '#909399',
    textAlign: 'center',
    padding: '30rpx',
    borderRadius: '50rpx',
    width: '400rpx',
    margin: '40rpx 0',
    fontFamily: 'PingFangSC, PingFang SC',
    fontWeight: 500,
    fontSize: '30rpx',
    color: '#F2F3F5',
    marginLeft: 'auto'
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4rpx',
    marginTop: '20rpx'
  },
  singleImage: {
    width: '300rpx',
    height: '300rpx',
    borderRadius: '8rpx',
    overflow: 'hidden'
  },
  gridImage: {
    position: 'relative',
    borderRadius: '8rpx',
    overflow: 'hidden'
  },
  'gridImage.two-columns': {
    width: 'calc((100% - 4rpx) / 2)',
    height: 'calc((100% - 4rpx) / 2)'
  },
  'gridImage.three-columns': {
    width: 'calc((100% - 8rpx) / 3)',
    height: 'calc((100% - 8rpx) / 3)'
  },
  imageMask: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24rpx'
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5rpx'
  },
  gridItem: {
    width: 'calc((100% - 10rpx) / 3)',
    height: 'auto',
    borderRadius: '5rpx'
  },
  gridItemImg: {
    height: '220rpx'
  }
}

 
 
 module.exports = {
  wxml,style
 }
