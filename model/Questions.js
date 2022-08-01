const mongoose = require("mongoose")
const Joi = require("@hapi/joi")


const schoolProfile = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

})

const SchoolProfile = mongoose.model("SchoolProfile", schoolProfile)

const sectionSchema = mongoose.Schema({
    name: {type: String, required: true}
})

const SchoolSection = mongoose.model("SchoolSection", sectionSchema)
 
const profileSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hasTakenSurvey: {
        type: Boolean,
        default: false
    },
    school: {
        type: {},
    }
 })

 const StudentProfile = mongoose.model("StudentProfile", profileSchema)


const QuestionSchema = mongoose.Schema({
 question: {
     type: String,
     required: true
 },
 section: {
     type: String,
     required: true
 },
 title: {
     type: String,
     required: true
 },
 options: {
     type: [{}]
 },
  
})


const Question = mongoose.model("StudentQuestion",QuestionSchema)


const answeredSchema = mongoose.Schema({
    profileId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentProfile"
    },
    question: {
        type: {},
    },
    answer: {
        type: String,
        required: true
    },
    posted_on: {
        type: Date,
        default: new Date()
    }
})


const AnsweredQuestion = mongoose.model("AnsweredQuestion", answeredSchema)

const schoolAnswered = mongoose.Schema({
    profileId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentProfile"
    },
    question: {
        type: {},
    },
    answer: {
        type: String,
        required: true
    },
    posted_on: {
        type: Date,
        default: new Date()
    }
})

const SchoolAnswered = mongoose.model("SchoolAnswered", schoolAnswered)


function validateAnswered(body){
    const schema = Joi.object({
        student: Joi.string().required().label("StudentID"),
        answers: Joi.array().min(1).label("Answer")
    })

    return schema.validate(body)
}





module.exports.Question = Question 
module.exports.AnsweredQuestion = AnsweredQuestion
module.exports.StudentProfile = StudentProfile
module.exports.validateAnswered = validateAnswered
module.exports.SchoolProfile = SchoolProfile
module.exports.SchoolAnswered = SchoolAnswered
module.exports.SchoolSection = SchoolSection