const KoaRouter = require('koa-router')
const router = new KoaRouter();
const tokenExpiresTime = require('../config').tokenExpiresTime;
const jwt = require('jwt-simple')
router.get('/',(ctx, next) => {

  ctx.body = '我是根路由'
})
router.get('/testAuth',(ctx, next) => {

  ctx.body = '我是根路由'
})

router.get('/login',(ctx, next) => {
    const user = ctx.request.query
    console.log(user)
    if (user && user.name){
        let payload = {
            exp:Date.now() + tokenExpiresTime,
            name:user.name
        }
        let token = jwt.encode(payload, 'jwtSecret')

        ctx.body = {
            user:user.name,
            code:1,
            token
        }
    }else {
        ctx.body = {
            code:-1
        }
    }
  // ctx.body = '认证'
})
router.get('/userinfo',(ctx, next) => {
  
  ctx.body = {
    data: ctx.state
  }
})

module.exports = router;