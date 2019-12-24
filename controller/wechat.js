let router = require('koa-router')();
let request = require('request');
let weChat = require('../config').weChat;
var User = require('../dataBase/schema/user');
router.get('/getCode', async (ctx, next) => {
  !ctx.query.code &&
    (ctx.body = {
      data: 'code is required '
    });
  // await next();
  try {
    const result = await new Promise(function(resolve, reject) {
      request.get(
        `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${weChat.appid}&secret=${weChat.secret}&code=${ctx.query.code}&grant_type=authorization_code`,
        async (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res.body);
        }
      );
    });
    if(!result.openid) {
      throw result
    }
    var user = new User({
      openid: result.openid,
      unionid: '',
      refresh_token: result.refresh_token,
      userName: Date.now(),
      password: 'String',
      sex: 'String',
      age: '',
      avator: ''
    });
    const dataRes = await user.save();
    ctx.body = dataRes;
  } catch(err) {
    ctx.body = err
  }
});
module.exports = router;
