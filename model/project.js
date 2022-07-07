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


module.exports.Project = Project
module.exports.Section = Section
module.exports.SectionQuestion = SectionQuestion
module.exports.validateProject = validateProject
module.exports.validateProjectSection = validateProjectSection
module.exports.validateQuestion = validateQuestion