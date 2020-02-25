/**
 * // https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN // 刷新toeken一个月失效 
 * 
 * https://api.weixin.qq.com/sns/auth?access_token=ACCESS_TOKEN&openid=OPENID 检验token 是否失效
 * 
 * https://api.weixin.qq.com/sns/oauth2/access_token?appid=${weChat.appid}&secret=${weChat.secret}&code=${ctx.query.code}&grant_type=authorization_code 根据code 获取access_token 
 * 
 * https://api.weixin.qq.com/sns/userinfo?access_token=${result.access_token}&openid=${result.openid}&lang=zh_CN 获取用户信息 
 */
let router = require('koa-router')();
let request = require('request');
let weChat = require('../config').weChat;
var User = require('../dataBase/schema/user');
let getConfigData = require('./wechat/getConfigData')
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
      let resultJson2 = await new Promise(function(resolve, reject) {
        request.get(
          `https://api.weixin.qq.com/sns/userinfo?access_token=${result.access_token}&openid=${result.openid}&lang=zh_CN`,
          async (err, res) => {
            if (err) {
              reject(err);
            }
            resolve(res.body);
          }
        );
      });
      const UserInfo = JSON.parse(resultJson2)
      console.log(UserInfo, result)
      if(UserInfo.errcode) {
        throw UserInfo
      }
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
    



    
  } catch(err) {
    ctx.body = err
  }
});
router.get('/getSigntrue', async (ctx, next) => {
  try {
    ctx.body = await getConfigData('http://39.97.170.243:9009')

  } catch(err) {
    ctx.body = err
  }
})
router.post('/getSigntrue', async (ctx, next) => {
  // console.log(ctx.request.body.url)
  try {
    ctx.body = await getConfigData(ctx.request.body.url)

  } catch(err) {
    ctx.body = err
  }
})
module.exports = router;
