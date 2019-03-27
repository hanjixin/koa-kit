const KoaRouter = require('koa-router')
const router = new KoaRouter();

router.get('/',(ctx, next) => {

  ctx.body = '我是根路由'
})


module.exports = router;