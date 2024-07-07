const User = require('../models/User')
const bcrypt = require("bcrypt");

exports.superAdmin = async ()=>{
    try{
    let password = await  bcrypt.hash('admin@1234', 10);
    let admin = await User.findOne({email:'admin@admin.com'})
    if(!admin){
    User.create({
        fname:'superAdmin',
        lname:'Deng',
        email:'admin@admin.com',
        isVerified: true,
        password: password,
        role:'super-admin'
    })}
   }catch(error){
    console.log(error)
   }
}
