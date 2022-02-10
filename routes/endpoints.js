const express = require("express")
const bcrypt = require("bcrypt")
const {User,validateLogin,validateSignUp} = require("../model/user")
const {Questionnaire,validateQuestionnaire} = require("../model/quesionaire")
const validateBody = require("../middleware/validateBody")
const auth = require("../middleware/auth")
const Router = express.Router()



Router.get("/questions",auth,async(req,res)=>{
  const questions = await Questionnaire.find()
  res.send(questions)
})


Router.get("/questions/:id",auth,async(req,res)=>{
  const question = await Questionnaire.findOne({_id:req.params.id})
  if (!question) res.status(404).send("Resource unavailable")

  res.send(question)
})


Router.get("/users",auth,async(req,res)=>{
  const users = await User.find()
  res.send(users)
})

Router.post("/register",validateBody(validateSignUp),async(req,res)=>{
    const {email,password,username} = req.body
    let user = await User.findOne({email})
    if(user) return res.status(400).send("Email already registered")

    user = new User({email,password,username})
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password,salt)
    await user.save()
    res.send(user.genAuthToken())

})

Router.post("/login",validateBody(validateLogin),async (req,res)=>{
  const {email,password} = req.body
  const user =await  User.findOne({email})
  if(!user) return res.status(400).send("Email or password incorrect")

  const isValid = await bcrypt.compare(password,user.password)
  if(!isValid) return res.status(400).send("Email or password incorrect")

  res.send(user.genAuthToken())
})


Router.post("/questions",[auth,validateBody(validateQuestionnaire)],async(req,res)=>{
   
      
      
   const {data,womanId,localityId,age,weight,height,hip,waist,fat,triceps,biceps,pressure} = req.body
   const questionnaire = new Questionnaire({
     officer:{
         name:req.user.username,
         email:req.user.email
     },
     data:data,
     womanId,
     localityId,
     age,
     weight,
     height,
     hip,
     waist,
     fat,triceps,biceps,pressure
   })

   
    await questionnaire.save()
    res.send(questionnaire)
})

Router.delete("/user/:id",auth,async(req,res)=>{
  const user = await User.findOne({_id:req.params.id})
  if(!user) return res.status(404).send("This resources is not available")

  await User.deleteOne({_id:req.params.id})
  res.send("User deleted")
})

module.exports = Router

