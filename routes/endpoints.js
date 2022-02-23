const express = require("express")
const bcrypt = require("bcrypt")
const multer = require("multer")
const readXlsxFile = require('read-excel-file/node')
const {User,validateLogin,validateSignUp} = require("../model/user")
const {Questionnaire,validateQuestionnaire,validateRequests,Request,DataSet,validateDataSet,Project,validateProject,Paper,validatePaper} = require("../model/quesionaire")
const validateBody = require("../middleware/validateBody")
const auth = require("../middleware/auth")
const req = require("express/lib/request")
const res = require("express/lib/response")
const Router = express.Router()
const upload = multer({ dest: 'uploads/' })


Router.get("/questions",auth,async(req,res)=>{
  const questions = await Questionnaire.find()
  res.send(questions)
})


Router.get("/requests",auth,async(req,res)=>{
  const requests = await Request.find()
  res.send(requests)
})

Router.get("/datasets",async(req,res)=>{
  const datasets = await DataSet.find()
  res.send(datasets)
})
Router.get("/projects",async(req,res)=>{
  const projects = await Project.find()
  res.send(projects)
})

Router.get("/papers",async(req,res)=>{
  const papers = await Paper.find()
  res.send(papers)
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


Router.post("/uploads",[auth,upload.single('excel')], async(req,res)=>{
 readXlsxFile(req.file.path).then((rows) => {
  const sections = {
    a:"Section A: Background Information",
    b:"Section B: Food Insecurity Experience Scale",
    c:"Section C: Morbidity and Compliance",
    d:"Section D: Gastrointestinal Side Effects"
  }
 let answers = rows.filter((r,index)=> index> 0)
 let questions = rows[0].filter((q,index) => index >= 12)
 for (let i= 0; i < answers.length; i++) {
  const obviousAnsers = answers[i].filter((ob,index)=> index <= 12)
  const abstractAnswers = answers[i].filter((ab,index)=>index >12)
  const data = abstractAnswers.map((ab,index)=>{
     let transformed = {answer:ab,quest:questions[index]}

      if (index < 15) transformed.section = sections.a

      if (index >= 15 && index < 24) transformed.section = sections.ab

      if (index >= 24 && index < 37) transformed.section = sections.c

      if(index >= 37) transformed.section = sections.d

      return transformed
   })
   const quesionaire = new Questionnaire({
     womanId:obviousAnsers[0],
     localityId:obviousAnsers[1],
     officer:{
       name:req.user.username,
       email:req.user.email
     },
     collected_on: new Date(obviousAnsers[3]),
     height:obviousAnsers[4],
     weight:obviousAnsers[5],
     biceps:obviousAnsers[6],
     triceps:obviousAnsers[7],
     hip:obviousAnsers[8],
     pressure:obviousAnsers[9],
     fat:obviousAnsers[10],
     age:obviousAnsers[11],
     waist:obviousAnsers[12],
     data
   })
   quesionaire.save().then(res=>console.log(res)).catch(err=>console.log(err))
 }
 
  res.send("Done")
})

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

Router.post("/requests",(validateBody(validateRequests)),async(req,res)=>{
  const {email,name,phone,description} = req.body
  const request = new Request({name,email,phone,description})
   await request.save()
   res.send(request)
})



Router.post("/dataset",[auth,validateBody(validateDataSet)],async(req,res)=>{
  const {title,description} = req.body
  const dataset = new DataSet({title,description})
  await dataset.save()
  res.send(dataset)
})
Router.post("/project",[auth,validateBody(validateProject)],async(req,res)=>{
  const {title,description} = req.body
  const project = new Project({title,description})
  await project.save()
  res.send(project)
})

Router.post("/paper",[auth,validateBody(validatePaper)],async(req,res)=>{
  const {file,heading} = req.body
  const paper = new Paper({file,heading,user:req.user.username})
  await paper.save()
  res.send(paper)
})

Router.delete("/user/:id",auth,async(req,res)=>{
  const user = await User.findOne({_id:req.params.id})
  if(!user) return res.status(404).send("This resources is not available")

  await User.deleteOne({_id:req.params.id})
  res.send("User deleted")
})

module.exports = Router

