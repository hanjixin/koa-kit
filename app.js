const Koa = require('koa');
const app = new Koa();
const router = require('./router/index');
const koaJwt = require('koa-jwt') //路由权限控制
const static = require('koa-static');
const port = require('./config').port;
const WhiteList = ['/login', '/register'];
const BodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');

const koaJsonLogger = require('koa-json-logger');
var cors = require('koa2-cors');
require('./dataBase')

app.use(async (ctx, next) => {
  console.log(ctx.URL.pathname, ctx.state)
  // console.log(ctx.request.header)
  const start = Date.now();
  await next().catch((err) => {
    if (401 == err.status) {
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
        throw err;
    }
});
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  // ctx.body = 'hello111'
})
app.use(koaJwt({secret:'jwtSecret', getToken(ctx) {
  return ctx.header.token
}}).unless({
  path:[/^\/login/]
}))
app.use(cors())

app.use(koaJsonLogger());
app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 2000*1024*1024    // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(router.routes())
app.use(router.allowedMethods())
app.use(static(__dirname+'/public'));

app.listen(port, () => {
  console.log('server is listen port ' + port)
})