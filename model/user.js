const mongoose = require("mongoose")
const JOI = require("joi")
const Jwt = require("jsonwebtoken")
const config = require("config")

const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    created_at:{type:String, default: new Date()}
})

userSchema.methods.genAuthToken = function(){
    return Jwt.sign({_id:this._id, email:this.email,username:this.username,created_at:this.created_at},config.get("key"))
}

const User = mongoose.model("User",userSchema)


function validateSignUp(body){
    const schema = JOI.object({
        username:JOI.string().min(3).required(),
        email:JOI.string().email().required(),
        password:JOI.string().min(6).max(10).required()
      
    })
    return schema.validate(body)
}


function validateLogin(body){
    const schema = JOI.object({
        email:JOI.string().email().required(),
        password:JOI.string().required()
    })

    return schema.validate(body)
}


module.exports.User = User
module.exports.validateSignUp =validateSignUp
module.exports.validateLogin = validateLogin