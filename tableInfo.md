userInfo表

* _id：主键
* _openid：微信用户唯一标识符
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
* create_time：帖子创建时间
* fileIds：九宫格图片url
* likes：点赞数
* userId：发帖人id