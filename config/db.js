const mongoose = require('mongoose');
exports.connectMonggose =()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true
    })
    .then((e)=>console.log("Connected to Mongodb =>> Classic technologies Website Project"))
    .catch((e)=>console.log("Not Connect Mongodb"))
}


// const mongoose = require('mongoose');
// exports.connectMonggose =()=>{
//     mongoose.set("strictQuery", false);
//     const localDB = 'mongodb://localhost:27017/classictechnologiesdb';
//
//     mongoose.connect(process.env.NODE_ENV === 'production' ? awsDB : localDB, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then((e)=>console.log("Connected to Mongodb =>>My portifolio Website"))
//     .catch((e)=>console.log("Not Connect Mongodb"))
// }
