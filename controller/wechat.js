let router = require('koa-router')();
let request = require('request');
let weChat = require('../config').weChat;
var User = require('../dataBase/schema/user');
router.get('/getCode', async ctx => {
  !ctx.query.code &&
    (ctx.body = {
      data: 'code is required '
    });
   request.get(
    `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${weChat.appid}&secret=${weChat.secret}&code=${ctx.query.code}&grant_type=authorization_code`,
     (err, res) => {
      err && (ctx = err);
      console.log(res.body)
      var user = new User({
        openid: res.openid,
        unionid: '',
        refresh_token: res.refresh_token,
        userName: Date.now(),
        password: 'String',
        sex: 'String',
        age: '',
        avator: ''
      });
       user
        .save()
        .then(re => {
          ctx.body = res;
        })
        .catch(e => {
          ctx.body = e;
        });
    }
  )
  ctx = {'ok': 'ok'}
});
module.exports = router;
