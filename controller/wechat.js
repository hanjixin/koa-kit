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
    let resultJson = await new Promise(function(resolve, reject) {
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
    const result = JSON.parse(resultJson)
    if(!result.openid) {
      throw result
    } else {
      let resultJson = await new Promise(function(resolve, reject) {
        request.get(
          `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${result.access_token}&openid=${result.openid}&lang=zh_CN

          `,
          async (err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res.body);
          }
        );
      });
      const UserInfo = JSON.parse(resultJson)
      console.log(UserInfo)
      var user = new User({
        openid: UserInfo.openid,
        unionid: '',
        refresh_token: result.refresh_token,
        userName: UserInfo.nickname,
        password: 'String',
        sex: UserInfo.sex + '',
        age: '100',
        avator: UserInfo.headimgurl
      });
      const dataRes = await user.save();
      ctx.body = dataRes;
    }
    // https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN


    
  } catch(err) {
    ctx.body = err
  }
});
module.exports = router;
