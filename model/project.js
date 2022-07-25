const mongoose = require("mongoose")
const Joi = require("@hapi/joi")


const ProjectSchema = mongoose.Schema({
    name: {type: String, required: true},
    date_posted: {type: Date, default: new Date()}
})

const Project = mongoose.model("Projexts", ProjectSchema)


const SectionSchema = mongoose.Schema({
    tag: {type: String, required: true},
    title: {type: String, required: true},
    project: {type: mongoose.Types.ObjectId, ref: "Project"}
})


const Section = mongoose.model("Section", SectionSchema)


const QuestionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    section: {
        type: {},
        required: true
    },
    
    options: {
        type: [{}]
    },
})


const SectionQuestion = mongoose.model("SectionQuestion", QuestionSchema)

const ProjectStudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    }

})

const ProjectStudent = mongoose.model("ProjectStudent", ProjectStudentSchema)



const ProjectQuestionAnsweredSchema = mongoose.Schema({
    profileId: {
        type: mongoose.Types.ObjectId,
        ref: "ProjectStudent"
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

const ProjectQuestionAnswered = mongoose.model("ProjectQuestionAnswered", ProjectQuestionAnsweredSchema)


function validateProject(body) {
    const schema = Joi.object({
        name: Joi.string().required().label("Project name")
    })
    return schema.validate(body)
}


function validateProjectSection(body) {
    const schema = Joi.object({
        tag: Joi.string().required().label("Section tag"),
        title: Joi.string().required().label("Section title"),
        project: Joi.string().required().label("Project ID")
    })
    return schema.validate(body)
}

function validateQuestion(body) {
    const schema = Joi.object({
        question: Joi.string().required().label("Question"),
        section: Joi.string().required().label("Section ID"),
        options: Joi.array().min(1).required().label("Options")
    })
    return schema.validate(body)
}


function validateProjectStudent(body) {
    const schema = Joi.object({
        name: Joi.string().required().label("Project name"),
        project_id: Joi.string().required().label("Project ID"),
    })
    return schema.validate(body)
}

function validateAnswered(body){
    const schema = Joi.object({
        student: Joi.string().required().label("StudentID"),
        answers: Joi.array().min(1).label("Answer")
    })

    return schema.validate(body)
}


module.exports.Project = Project
module.exports.Section = Section
module.exports.SectionQuestion = SectionQuestion
module.exports.validateProject = validateProject
module.exports.validateProjectSection = validateProjectSection
module.exports.validateQuestion = validateQuestion
module.exports.ProjectStudent = ProjectStudent
module.exports.ProjectQuestionAnswered = ProjectQuestionAnswered
module.exports.validateProjectStudent = validateProjectStudent
module.exports.validateAnswered = validateAnswered