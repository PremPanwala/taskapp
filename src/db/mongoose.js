const mongoose =require('mongoose');
mongoose.connect(process.env.mongo_key,{useNewUrlParser:true,useCreateIndex:true,

useFindAndModify:false,
useUnifiedTopology:true})

