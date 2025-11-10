const express= require('express')



const app=express()
//<--------------local--------------->
 const port=3002
//<--------------------------------->
//<-------Testing------------------->
// const port=5100
//<-------------------------------------->
//<-----------------For production---------------->
// const port=20000
//<------------------------------------------->
const cors= require('cors')
const cookieparser=require('cookie-parser')
require('./db/conn')
const router=require('./routes/router') 

//middleware
app.use(express.json())

app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001','https://erp.databin.in/',
    'https://erp.databin.in','https://terp.cloudbin.in/','https://terp.cloudbin.in','https://terp.databin.in/','https://terp.databin.in'],

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(cookieparser())

app.use(router)
app.use(cors());
app.options('*', cors());

app.listen(port,()=>{
  console.log("server start at port:" + port)
})