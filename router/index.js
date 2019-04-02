const KoaRouter = require('koa-router')
const router = new KoaRouter();
const fs = require('fs')
const path = require('path')
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
router.post('/uploadfile', async (ctx, next) => {
  // 上传单个文件
  
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  console.log(ctx.request.files)
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
  // 创建可写流
  console.log(filePath)
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  console.log('上传成功！')
  return ctx.body = "上传成功！";
});

module.exports = router;