// importing third party modules(libraries) needed for this module
const express = require("express")
const bcrypt = require("bcrypt")
const multer = require("multer")
const readXlsxFile = require('read-excel-file/node')
const upload = multer({ dest: 'uploads/' })

// importing the local modules(modules from this project) needed for this module
const {User,validateLogin,validateSignUp} = require("../model/user")
const {Questionnaire,SecondQuestionaire,validateSecondQuestionnaire,validateQuestionnaire,validateRequests,Request,DataSet,Zip,validateZip,validateDataSet,Project,validateProject,Paper,validatePaper} = require("../model/quesionaire")
const validateBody = require("../middleware/validateBody")
const auth = require("../middleware/auth")
const req = require("express/lib/request")
const res = require("express/lib/response")

// Instantiating express router
const Router = express.Router()




// This route handler handles the querying the questionnaire model.
// It makes use of the auth middleware making sure the user is signedin
Router.get("/questions",auth,async(req,res)=>{
  const questions = await Questionnaire.find()
  res.send(questions)
})

// This route handler handles the querying the second questionnaire model
// It also makes use of the auth middleware making sure the user is signin
Router.get("/second-questions",auth,async(req,res)=>{
  const questions = await SecondQuestionaire.find()
  res.send(questions)
})


// This route handler handles the querying of the data requests from
// the admin dashboard.
Router.get("/requests",auth,async(req,res)=>{
  const requests = await Request.find()
  res.send(requests)
})

// This route handler handles the fetching of datasets uploaded by 
// the admins from the dashboard
Router.get("/datasets",async(req,res)=>{
  const datasets = await DataSet.find()
  res.send(datasets)
})

// This route handler handles the fetching of projects added by the 
// admins from the dashboard
Router.get("/projects",async(req,res)=>{
  const projects = await Project.find()
  res.send(projects)
})


// here below, the rouet handler handles fetching of uploaded papers
// by the admins from the dashboard.
Router.get("/papers",async(req,res)=>{
  const papers = await Paper.find()
  res.send(papers)
})

// This handler fetches the zip files uploaded by  the admin on the 
// dashboard. It uses the auth middleware to make sure the admin is authenticated
Router.get("/zips",auth,async(req,res)=>{
  const zips = await Zip.find()
  res.send(zips)
})


// This route handler fetches a particular questionnaire depending on the id
// passed to the route. It makes use of the auth middleware making sure the admin 
// is authenticated.
Router.get("/questions/:id",auth,async(req,res)=>{
  const question = await Questionnaire.findOne({_id:req.params.id})
  if (!question) res.status(404).send("Resource unavailable")

  res.send(question)
})


// This is the route handler that fetches all user to be displayed on
// the dashboard
Router.get("/users",auth,async(req,res)=>{
  const users = await User.find()
  res.send(users)
})


// Below route handler handles a post request. It handles the register/ signup feature

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

// This is the route handler that handles the login feature.
// It is important to note the usage of the validateBody middleware.
Router.post("/login",validateBody(validateLogin),async (req,res)=>{
  const {email,password} = req.body
  const user =await  User.findOne({email})
  if(!user) return res.status(400).send("Email or password incorrect")

  const isValid = await bcrypt.compare(password,user.password)
  if(!isValid) return res.status(400).send("Email or password incorrect")

  res.send(user.genAuthToken())
})


// This the route handler handles the uploads of excel files from
// the dashboard. The route handler makes use of the multer module to 
// facilitate the upload
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

// This route handler handles the posting of questionnaire taken.
// It is important to note the middleware used here(auth and validateBody)
// The implementation of these middlware can be found in their respective files
// in the middleware folder
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


// This route handler handles the posting of the second questionnaire taken
// this route handler follows the same principle as the one above
Router.post("/second-questions",[auth,validateBody(validateSecondQuestionnaire)],async(req,res)=>{
  const {data} = req.body
  const questionnaire = new SecondQuestionaire({
    officer:{
        name:req.user.username,
        email:req.user.email
    },
    data:data,
  })

   await questionnaire.save()
   res.send(questionnaire)
})


// This is the route handler that handles the posting of data requests
Router.post("/requests",(validateBody(validateRequests)),async(req,res)=>{
  const {email,name,phone,description,reason} = req.body
  const request = new Request({name,email,phone,description,reason})
   await request.save()
   res.send(request)
})


// This route handler handles the posting/uploading of zip files
Router.post("/zip",[auth,validateBody(validateZip)],async(req,res)=>{
  const {file, name, description} = req.body
  const zip = new Zip({file, name, description})
  await zip.save()
  res.send(zip)
})

// This route handler handles the posting of datasets
Router.post("/dataset",[auth,validateBody(validateDataSet)],async(req,res)=>{
  const {title,description} = req.body
  const dataset = new DataSet({title,description})
  await dataset.save()
  res.send(dataset)
})

// This route handler handles the posting of projects
Router.post("/project",[auth,validateBody(validateProject)],async(req,res)=>{
  const {title,description} = req.body
  const project = new Project({title,description})
  await project.save()
  res.send(project)
})


// Below is the route handler that handles the posting of paper works
Router.post("/paper",[auth,validateBody(validatePaper)],async(req,res)=>{
  const {file,heading,type, author} = req.body
  const paper = new Paper({file,heading,user:author,type , isApproved: type === "student"? false: true})
  await paper.save()
  res.send(paper)
})



Router.put("/approve-paper/:id",[auth],async(req, res)=> {
  const paper = await Paper.findById(req.params.id)
  paper.isApproved = !paper.isApproved
  await paper.save()
  res.send(paper)
  
})


// This is the route handler that handles the alteration of user privileges
Router.put("/priv/:id",auth,async(req,res)=>{
  const user = await User.findById(req.params.id)
  if(!user) return res.status(404).send("This user is unavailable") 

  if(user.isAdmin){
    user.isAdmin = false
    await user.save()
  }
   
  else {
    user.isAdmin = true
    user.isGuest = false
    await user.save()
  }

  res.send(user)
})


Router.put("/guest/:id",auth,async(req,res)=>{
  const user = await User.findById(req.params.id)
  if(!user) return res.status(404).send("This user is unavailable") 
 
    user.isGuest = true
    user.isAdmin = false
    await user.save()
 
  res.send(user)
})


// Below is the route handler that handles the 'delete user' feature
Router.delete("/user/:id",auth,async(req,res)=>{
  const user = await User.findOne({_id:req.params.id})
  if(!user) return res.status(404).send("This resources is not available")

  await User.deleteOne({_id:req.params.id})
  res.send("User deleted")
})


// Below is the route handler that handles the "delete dataset" feature
Router.delete("/datasets/:id",auth,async(req,res)=>{
  const dataset = await DataSet.findById(req.params.id)
  if(!dataset) return res.status(404).send("This dataset is unavailable")

  await DataSet.deleteOne({_id:req.params.id})
  res.send("Deleted")
})

// This is the route handler that handles the 'delete paper' feature
Router.delete("/papers/:id",auth,async(req,res)=>{
  const paper = await Paper.findById(req.params.id)
  if(!paper) return res.status(404).send("This paper is unavailable")

  await Paper.deleteOne({_id:req.params.id})
  res.send("Deleted")
})


// Below is the route handler that handles the 'delete project' feature
Router.delete("/projects/:id",auth,async(req,res)=>{
  const project = await Project.findById(req.params.id)
  if(!project) return res.status(404).send("This paper is unavailable")

  await Project.deleteOne({_id:req.params.id})
  res.send("Deleted")
})

Router.delete("/questionnaire/:id",auth,async(req,res)=>{
  const questionnaire = await Questionnaire.findById(req.params.id)
  if(!questionnaire) return res.status(404).send("This questionnaire is unavailable")

  await Questionnaire.deleteOne({_id:req.params.id})
  res.send("Deleted")
})


// exporting the route handler to be used in the app entry
module.exports = Router

