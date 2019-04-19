//导入模块
const express=require('express');
const cors=require('cors')
const bodyParser=require('body-parser');
//导入路由器
const Router=require('./routes/router.js');
//创建服务器
var server=express();
//监听3000端口
server.listen(process.env.PORT || 5050);
//引入session模块
const session=require("express-session");
//配置session
server.use(session({
    secret:"alan", //128位随机字符串
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60
    }
}))
//托管静态文件到public目录下
server.use(express.static('./public'));
server.use(express.static('./images'));

server.use(cors({
    origin:["http://127.0.0.1:8080","http://localhost:8080"],
    credentials:true
}));
//使用系统自带解析post请求
server.use(bodyParser.urlencoded({
 extended:false
}));
//挂载user路由器
server.use('/',Router);


