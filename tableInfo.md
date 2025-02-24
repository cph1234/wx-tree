userInfo表

* _id：主键
* open_id：微信用户唯一标识符
* avatar_url：用户头像url
* identity：组长/组员
* my_attention：我的关注
* my_fans：我的粉丝
* my_team_number：我的组员
* name：微信名
* registration_time：首次登陆时间
* my_likes：我赞过的帖子id



treeFriendsCircleInfo表

* _id：主键
* comment：评论数组
  * content：评论内容
  * userId：评论人id
  * userName：评论人名字
* content：内容
* create_time：帖子创建时间
* fileIds：九宫格图片url
* likes：点赞数
* userId：发帖人id
* treeId：树木Id



treeInfo表

* _id：主键
* treeType：树类型
* position：定位
* altitude：海拔
* sunshine：日照情况
* soil：土壤
* weather：天气
* treeDimensions：树木规格
* createTime：登记时间
* userId：登记用户


homeworkInfo表

* _id：主键
* treeId：树木Id
* title：题目
* userid：用户id
* position：位置
* createTime：作业时间
* frontContent：前言
* details：详情(array)
  * type：类型
  * files：图片url
  * text：文字描述
* endContent：结语