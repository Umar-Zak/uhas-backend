const express = require("express")
const auth = require("../middleware/auth")
const validateBody = require("../middleware/validateBody")
const {Question, StudentProfile, AnsweredQuestion, validateAnswered}  = require("../model/Questions")


const Router = express.Router()


Router.get("/:section",auth,async (req, res) => {
    let questions = await Question.find()
    questions = questions
    .filter(ques => ques.section.toLowerCase() 
    === req.params.section.toLowerCase())

    res.send(questions)
})


Router.get("/get/profiles", auth, async(req, res) => {
    const profiles = await StudentProfile.find()
    res.send(profiles)
})

Router.get("/get/answered/:id", auth, async(req, res) =>{
    const answers = await  AnsweredQuestion.find({profileId: req.params.id})
    res.send(answers)
})
Router.get("/get/answers", async(req, res) =>{
    const answers = await  AnsweredQuestion.find()
    res.send(answers)
})


Router.post("/profile", auth, async(req, res) => {
    const profile = new StudentProfile({name: req.body.name})
    await profile.save()
    res.send(profile)
})


Router.post("/answer", [auth, validateBody(validateAnswered)], async(req, res) => {
    const {student, answers} = req.body
    for(let i =0; i< answers.length; i++){
        const question = await Question.findById(answers[i].question)
        const answered = new AnsweredQuestion({
            profileId: student,
            question,
            answer: answers[i].answer
        })


        await answered.save()
    }

    const profile = await StudentProfile.findById(student)
    profile.hasTakenSurvey = true
    await profile.save()
   
    setTimeout(() => {
        res.send("Saved....")
    }, 3000)
})


Router.put("/answer/:id", auth, async(req, res) => {
    const answer = await AnsweredQuestion.findById(req.params.id)
    if(!answer) return res.status(404).send("This resource is unavailable")

    answer.answer = req.body.answer
    await answer.save()
    res.send("Answer edited")
})

Router.delete("/profile/:id",auth, async (req, res) => {
    const profile = await StudentProfile.findById(req.params.id)
    if(!profile) return res.status(404).send("This student is unavailabsle")

    await StudentProfile.deleteOne({_id: req.params.id})

    res.send("Student deleted...")
})

module.exports = Router