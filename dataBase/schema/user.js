const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型
//创建我们的用户Schema
const userSchema = new Schema({
    UserId:ObjectId,
    userName:{unique:true,type:String},
    password:String,
    sex: String,
    age: String,
    avator: String,
    createAt:{type:Date,default:Date.now()},
    lastLoginAt:{type:Date,default:Date.now()}
})
//发布模型
mongoose.model('User',userSchema)
// String ：字符串类型
// Number ：数字类型
// Date ： 日期类型
// Boolean： 布尔类型
// Buffer ： NodeJS buffer 类型
// ObjectID ： 主键,一种特殊而且非常重要的类型
// Mixed ：混合类型
// Array ：集合类型