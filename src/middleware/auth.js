const User=require('../models/user');
const jwt=require('jsonwebtoken');
const auth=async(req,res,next)=>{
    try{
    console.log(req.header('Authorization'))
    const token=req.header('Authorization').replace('Bearer ','');
    const user=jwt.verify(token,process.env.jwt_key)
    console.log(user)
    const ans=await User.findOne({_id:user._id,'tokens.token':token});
    if(!ans)
    {
        throw new Error()
    }
    req.token=token;
    req.user=ans
    next();
    }
    catch(e)
    {
        res.status(401).send(e);
    }

}
module.exports=auth;