const express =require('express');
const multer=require('multer');
const sharp=require('sharp')
const User=require('../models/user');
const {welcome,cancel}=require('../emails/account')
const auth=require('../middleware/auth')
const router=new express.Router();
router.post('/users',async(req,res)=>{
    console.log(req.body)
    const user=new  User(req.body);
    const token=await user.generateAuth();
    res.status(200).send({user,token});
    try{
    await user.save();
        welcome(user.name,user.password)
    //res.status(201).send(user);
    }
    catch(e)
    {
        res.status(400).send(e) 
    }
    
})
router.post('/users/login',async(req,res)=>{
    try{
    const user= await User.findByCredentials(req.body.name,req.body.password);
    const token=await user.generateAuth();
    res.status(200).send({user,token});
    }
    catch(e)
    {
        res.status(400).send(e)
    }

})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save();
        res.status(200).send("Logout Sucessfully")
    }
    catch(e)
    {
        res.status(500).send(e);
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save();
        res.status(200).send("LogoutAll Sucessfully")
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})




router.get('/users',auth,async(req,res)=>{
    res.status(200).send(req.user)
   
})



router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const ans=['name','password','age'];
    const ans1=updates.every((update)=>ans.includes(update))
    if(!ans1)
    {
        return res.status(400).send({error:'Invalid'})
    }
try{
    const user=await User.findById(req.user._id);
    updates.forEach((update)=>{
        req.user[update]=req.body[update];
    })
    await req.user.save();
    res.status(200).send();
}catch(e)
{
    res.status(400),send(e);
}

})

router.delete('/users/me',auth,async(req,res)=>{
    console.log("Hi from delete")
try{
     
    await req.user.remove();
    cancel(req.user.name,req.user.password)
    res.status(200).send(req.user);
}catch(e)
{
    res.status(400).send(e);
}
})
const upload=multer({

limits:{
    fileSize:1000000
},
fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/))
    {
       return  cb( new Error("Please UPLOAD ONLY IMAGE"))
    }
    cb(undefined,true)
}
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
    const user=await User.findById(req.params.id);

    if(!user || !user.avatar)
    {
        throw new Error();
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
}
catch(e)
{
    res.status(404).send()
}
}
)




module.exports=router;