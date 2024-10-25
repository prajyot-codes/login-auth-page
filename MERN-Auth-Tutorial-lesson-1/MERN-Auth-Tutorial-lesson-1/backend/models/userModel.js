const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})


// static signup method
userSchema.statics.signup = async function(email,password){
    if (!email || !password){
        throw Error(`nothing has been entered`)
    }
    if(!validator.isEmail(email)){
        throw Error('please enter a valid email')
    }
    if (!validator.isStrongPassword(password)){
        throw Error('password not strong enough enter password must contain an uppercase lowercase and a symbol');
    }
    const exits = await this.findOne({ email })
    if (exits){ 
        throw Error('email already in use');
    }
    // using await is really essential and it may lead to app crashes if not used properly
    const salt =await bcrypt.genSalt(10);
    const hash =await bcrypt.hash(password,salt);
    
    const user =await this.create({email, password:hash})
    return user;
}
// static login method
userSchema.statics.login= async function (email,password) {
    if (!email || !password){
        throw Error(`nothing has been entered`)
    }
    const user = await  this.findOne({email});
    
    if (!user){
        throw Error("this username doesnt exits")
    }
    const match =await  bcrypt.compare(password,user.password);
    if (!match){
        throw Error("wrong passwd enterd");
    }
    return user;
}
module.exports = mongoose.model('User',userSchema)