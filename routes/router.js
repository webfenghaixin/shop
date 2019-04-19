//导入模块
const express=require('express');
//导入连接池
const pool=require('../pool.js');
//创建路由器
var router=express.Router();

// 用户注册
router.post("/userReg",(req,res)=>{
	var uname=req.body.uname;
	var upwd=req.body.upwd;
	var phone=req.body.phone;
  	var gender=req.body.gender;
	var sql="INSERT INTO store_user SET uname=?,upwd=md5(?),phone=?,gender=?";
	pool.query(sql,[uname,upwd,phone,gender],(err,result)=>{
		if(err) throw err;
		 if(result.affectedRows>0){
			res.send({code:1,msg:"注册成功"})
		 }
	})
})
// 用户登录
router.post("/login",(req,res)=>{
	var uname=req.body.uname;
	var upwd=req.body.upwd;
	var sql="select id,uname from store_user where uname=? and upwd=md5(?)";
	pool.query(sql,[uname,upwd],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			//保存用户登录状态
			req.session.uid=result[0].id;
			res.send({code:1,data:result[0].uname})
		}else{
			res.send({code:-1,msg:"登录失败"})
		}
	})
})
// 获取购物车信息
router.get("/getcart",(req,res)=>{
	var uid=req.session.uid;0

	if(uid){
		var sql="select id,uid,cid,count,color,img_url,title,price from store_shopcart where uid=?";
		pool.query(sql,[uid],(err,result)=>{
			if(err) throw err;
			res.send({code:1,data:result})
		})
	}else{
		res.send({code:-1,msg:"请先登录！"})
	}
})

// 添加购物车
router.get("/addcart",(req,res)=>{
	var suid=req.session.uid;
	console.log(suid)
	if(suid){
		var cid=req.query.cid;
		var count=req.query.count;
		var title=req.query.title;
		var color=req.query.color;
		var img_url=req.query.img;
		var price=req.query.price;
		//从session中获取uid
		var uid=suid;
		var sql="select id,uid,cid,count from store_shopcart where uid=? and cid=?";
		pool.query(sql,[uid,cid],(err,result)=>{
			if(err) throw err;
			if(result.length>0){
				for(var i=0;i<result.length;i++){
					if(result[i].cid==cid){ 
						var sum=parseInt(count)+parseInt(result[i].count);
						console.log(count,result[i].count,sum)
						var sqlu="update store_shopcart set count=? where uid=? and cid=?";
						pool.query(sqlu,[sum,uid,cid],(err,result)=>{
							console.log(1123)
							if(err) throw err;
							res.send({code:1,msg:"添加成功！"});
						})
						return;
					}
			}
			}else{
				var sqli="insert into store_shopcart set cid=?,uid=?,count=?,title=?,img_url=?,color=?,price=?";
				pool.query(sqli,[cid,uid,count,title,img_url,color,price],(err,result)=>{
				if(err) throw err;
					res.send({code:1,msg:"添加成功！"})
				})
				return;
			}
		})
	}else{
		res.send({code:-1,msg:"请先登录！"})
	}
})
//删除购物车商品
router.get("/delcart",(req,res)=>{
	var uid=req.session.uid;
	var cid=req.query.cid;
	var sql="delete from store_shopcart where find_in_set(cid,?) and uid=?";
	pool.query(sql,[cid,uid],(err,result)=>{
		if(err) throw err;
		res.send({code:1,msg:"删除成功"})
	})
})
//查询主页图片信息
router.get("/getindex",(req,res)=>{
	var sql="select id,pid,title,subtitle,img_url,price,delprice from store_index";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send({code:1,data:result})
	})
})
//查询商品列表信息
router.get("/getlist",(req,res)=>{
	var sql="select id,lid,title,subtitle,img_url,price,delprice,color from store_goodlist";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send({code:1,data:result})
	})
})
//查询商品详情
router.get("/getdetail",(req,res)=>{
	var $id=req.query.id;
	var sql="select id,lid,title,subtitle,img_url,price,delprice,color from store_goodlist where id=?";
	pool.query(sql,[$id],(err,result)=>{
		if(err) throw err;
		res.send({code:1,data:result});
	})
})
//搜索功能
	router.get("/searchdetail",(req,res)=>{
		var msg=req.query.msg;
		console.log(msg)
		var sql="select id,lid,title,subtitle,img_url,price,delprice,color from store_goodlist where title like ?";
		pool.query(sql,[`%${msg}%`],(err,result)=>{
			if(err) throw err;
			if(result.length>0){
				res.send({code:1,data:result})
			}else{
				res.send({code:1,msg:"无该商品"})
				}
		})
	})
//测试题接口
router.get("/get",(req,res)=>{
		var sql="select * from text";
		pool.query(sql,(err,result)=>{
			if(err) throw err;
			res.send({code:1,data:result})
		})
	})
//导出路由器
  module.exports=router;
