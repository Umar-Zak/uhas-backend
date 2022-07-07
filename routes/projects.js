const express = require("express")
const auth = require("../middleware/auth")
const validateBody = require("../middleware/validateBody")
const {Project, validateProject, Section, validateProjectSection, validateQuestion, SectionQuestion}  = require("../model/project")


const Router = express.Router()



 Router.get("/", auth, async(req, res) => {
   const projects = await Project.find()
   res.send(projects)
  
 })

 Router.get("/sections", auth, async(req, res) => {
   const sections = await Section.find()
   res.send(sections)
})

Router.get("/questions/:id", auth, async(req, res) => {
   let questions = await SectionQuestion.find()
   questions = questions.filter(ques => ques.section._id.toString() === req.params.id)
   res.send(questions)
})

Router.get("/sections/:id", auth, async(req, res) => {
   const section = await Section.findById(req.params.id)
   if(!section) return res.status(404).send("This section is unavailable")

   res.send(section)
})


 Router.get("/:id", auth, async(req, res) => {
    const project = await Project.findById(req.params.id)
    if(!project) return res.status(404).send("This project is unavailable")

    res.send(project)
 })



 Router.post("/", [auth, validateBody(validateProject)], async(req, res) => {
    const project = new Project({
        name: req.body.name
    })

    await project.save()

    res.status(201).send(project)
 })

 Router.post("/section", [auth, validateBody(validateProjectSection)], async(req, res) => {
   const {tag, title, project} = req.body
   const section = new Section({
       tag,
       title,
       project
   })

   await section.save()

   res.status(201).send(section)
})

Router.post("/question", [auth, validateBody(validateQuestion)], async(req, res) => {
   const {section, question, options} = req.body
   const sect = await Section.findById(section)
   const quest = new SectionQuestion({
       section: sect,
       question,
       options
   })

   await quest.save()
   res.status(201).send(quest)
})



 Router.put("/:id", [auth, validateBody(validateProject)], async(req, res) => {
    const project = await Project.findById(req.params.id)
    if(!project) return res.status(404).send("This project is unavailable")

    project.name = req.body.name 

    await project.save()

    res.send(project)
 })


 Router.delete("/section/:id", auth, async(req, res) => {
   const section = await Section.findById(req.params.id)
   if(!section) return res.status(404).send("This section is unavailable")

   await Section.deleteOne({_id: req.params.id})

   res.send("Deleted")
})

Router.delete("/question/:id", auth, async(req, res) => {
   const question = await SectionQuestion.findById(req.params.id)
   if(!question) return res.status(404).send("This questionnaire is unavailable")

   await SectionQuestion.deleteOne({_id: req.params.id})

   res.send("Deleted")
})

 Router.delete("/:id", auth, async(req, res) => {
    const project = await Project.findById(req.params.id)
    if(!project) return res.status(404).send("This project is unavailable")

    await Project.deleteOne({_id: req.params.id})

    res.send("Deleted")
 })

module.exports = Router