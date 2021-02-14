require('../src/db/mongoose')
const Tasks=require('../src/models/task');

// Tasks.findByIdAndDelete('5fe58750f6841c15bca137b9').then((tasks)=>{
//     console.log(tasks);
//     return Tasks.countDocuments({completed:false});
// }).then((tasks1)=>{
//     console.log(tasks1);
// }).catch((e)=>{
//     console.log(e);
// })

const deleteTaskandCount=async(id)=>{
    console.log("HI BRO")
    const tasks= await Tasks.findByIdAndDelete(id);
    const ans= await  Tasks.countDocuments({completed:false});
    return ans;
}
deleteTaskandCount('5fe56c57cd6da632ac19aa34').then((tasks1)=>{
    console.log(tasks1);
}).catch((e)=>{
    console.log(e);
})