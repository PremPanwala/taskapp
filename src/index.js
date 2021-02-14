const express =require('express');
require('./db/mongoose');
const User=require('./models/user');
const userroute=require('./routers/user');
const taskroute=require('./routers/task');
const Tasks=require('./models/task');
const app=express();
const PORT=process.env.PORT;


app.use(express.json());
app.use(userroute);
app.use(taskroute);
app.listen(PORT,()=>{
    console.log("Server Started "+ PORT);
})
const Task=require('./models/task');

