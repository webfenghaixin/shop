const mysql=require('mysql');
var pool=mysql.createPool({
   host:'0.0.0.0',
   post:'5050',
   user:'root',
   password:'',
   database:'store',
   connectionLimit:20
});
module.exports=pool;