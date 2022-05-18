// importing third party modules needed for this module
const mongoose = require("mongoose")
const JOI = require("joi")
const Jwt = require("jsonwebtoken")
const config = require("config")


// Below is instatiating the user schema.
const userSchema = mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    created_at:{type:String, default: new Date()},
    isAdmin:{type:Boolean,default:false},
    isGuest: {type: Boolean, default: false}
})

// From, the below code, I'm attaching a method to the user schema
// that generates the user's authentication token when the signup or signin
userSchema.methods.genAuthToken = function(){
    return Jwt.sign({_id:this._id, email:this.email,username:this.username,created_at:this.created_at,isAdmin:this.isAdmin, isGuest: this.isGuest},config.get("key"))
}


// Below is the code for the users model
const User = mongoose.model("User",userSchema)



// Below is the function that validates the signup form data 
// submitted by the user
function validateSignUp(body){
    const schema = JOI.object({
        username:JOI.string().min(3).required(),
        email:JOI.string().email().required(),
        password:JOI.string().min(6).max(10).required()
      
    })
    return schema.validate(body)
}

// Below is the function that validates the login form data
// submitted by the user
function validateLogin(body){
    const schema = JOI.object({
        email:JOI.string().email().required(),
        password:JOI.string().required()
    })

    return schema.validate(body)
}

// Exporting the various pieces below to be accessed in other modules(files)
module.exports.User = User
module.exports.validateSignUp =validateSignUp
module.exports.validateLogin = validateLogin