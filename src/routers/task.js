const express=require('express');
const Tasks=require('../models/task');
const auth=require('../middleware/auth')
const router=new express.Router();
router.get('/tasks',auth,async(req,res)=>{
   const match={}
   const sort={}
   if(req.query.completed)
   {
       match.completed=req.query.completed==='true'
   }
   if(req.query.sortBy)
   {
       const part=req.query.sortBy.split(':');
       sort[part[0]]=part[1] ==='desc' ? -1 : 1
   }

    try{
//const tasks=await   Tasks.find({owner:req.user._id});
await req.user.populate({
    path:'tasks',
    match,
    options:{
    limit:parseInt(req.query.limit),
    skip:parseInt(req.query.skip),
    sort
}
}).execPopulate()
res.status(200).send(req.user.tasks);
    }catch(e)
    {
        res.status(400).send(e)
    }
   
})

router.get('/tasks/:id',auth,async(req,res)=>{
    console.log('task route')
    const _id=req.params.id
    console.log(req.params.id)
    console.log(req.user._id)
    try{
    const tasks=await Tasks.findOne({_id,owner:req.user._id});
    if(tasks)
        {
            console.log("hi bro");
            return res.status(200).send(tasks);;
        }
        res.status(404).send();
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const ans=['description','completed'];
    const ans1=updates.every((update)=>ans.includes(update))
    if(!ans1)
    {
        return res.status(400).send({error:'Invalid'})
    }
try{
        const task=await Tasks.findOne({_id:req.params.id,owner:req.user._id});
       
  //  const task=await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!task)
    {
        return res.status(404).send();
    }
    updates.forEach((update)=>{
        task[update]=req.body[update];
    })
    await task.save();
    res.status(200).send(task);
}catch(e)
{
    res.status(400).send(e);
}

})



router.post('/tasks',auth,async(req,res)=>{
    console.log(req.body)
    
    const tasks=new  Tasks({
        ...req.body,
        owner:req.user._id
    });
    try{
    await tasks.save();
    res.status(201).send(tasks);
    }
    catch(e)
    {
        res.status(400).send(e)
    }
    
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    console.log("Hi from delete")
try{
    const tasks=await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if(!tasks)
    {
        return res.status(404).send();
    }
    res.status(200).send(tasks);
}catch(e)
{
    res.status(400),send(e);
}
})
module.exports=router;