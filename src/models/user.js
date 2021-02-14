const mongoose =require('mongoose');
const bcrypt=require('bcryptjs');
const Tasks=require('./task')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true
    }, password:{
        type:String,
        required:true,
        minLength:6,
        trim:true,
        validate(value){
            if(value === 'password')
            {
                throw new Error('Password cannot be Password')
            }
        }
    },age:{
        type:Number
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
   
},{
    timestamps:true,
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})


userSchema.methods.toJSON=function()
{
    const user=this;
    const ans=user.toObject();
    delete ans.password;
    delete ans.tokens;
    delete ans.avatar;
    return ans;

}
userSchema.methods.generateAuth=async function (){
    console.log("HI i am here")
    const user=this;
    console.log(user._id.toString())
    const token=  jwt.sign({_id:user._id.toString()},process.env.jwt_key);
    console.log(token)
     user.tokens=user.tokens.concat({token})
     await user.save()
    return token
    

}
userSchema.statics.findByCredentials=async(name,password)=>{
    const user=await User.findOne({name});
    if(!user)
    {
        throw new Error("Unable to login")
    }
    const ismatch=await bcrypt.compare(password,user.password);
    if(!ismatch)
    {
        throw new Error("Unable to Login");
    }
    return user;
}


userSchema.pre('save',async function(next){
console.log("Hey ");
const user=this;

if(user.isModified('password'))
{
    user.password=await bcrypt.hash(user.password,8);
}
next();
})

userSchema.pre('remove',async function (next){
    const user=this;
    await Tasks.deleteMany({owner:user._id});
    next();
})

const  User=mongoose.model('User',userSchema)
module.exports=  User;