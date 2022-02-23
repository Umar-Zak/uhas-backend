const mongoose = require("mongoose")
const Joi = require("joi")

 
           
           
         

const questionaireSchema = mongoose.Schema({
    officer:{type:mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true}
    })},
    collected_on:{type:Date, default:new Date()},
    data:{type:[]},
    womanId:{type:String,required:true},
    localityId:{type:String,required:true},
    age:{type:Number,required:true},
    weight:{type:Number,required:true},
    height:{type:Number,required:true},
    hip:{type:Number,required:true},
    waist:{type:Number,required:true},
    fat:{type:Number,required:true},
    triceps:{type:Number,required:true},
    biceps:{type:Number,required:true},
    pressure:{type:Number,required:true}
})

const requestSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    description:{type:String,required:true}
})

const Request = mongoose.model("Request",requestSchema)


const datasetSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true}
})

const DataSet = mongoose.model("DataSet",datasetSchema)

const projectSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true}
})

const Project = mongoose.model("Project",projectSchema)


const paperSchema = mongoose.Schema({
    file:{type:String,required:true},
    heading:{type:String,required:true},
    user:{type:String,required:true},
    date:{type:Date, default:new Date()}
})

const Paper = mongoose.model("Paper",paperSchema)

function validateQuestionnaire(body){
  const schema = Joi.object({
      data:Joi.array().min(1).required(),
      womanId:Joi.string().required(),
      localityId:Joi.string().required(),
      age:Joi.number().min(1).required(),
      weight:Joi.number().required(),
      height:Joi.number().required(),
      hip:Joi.number().required(),
      waist:Joi.number().required(),
      fat:Joi.number().required(),
      triceps:Joi.number().required(),
      biceps:Joi.number().required(),
      pressure:Joi.number().required()
  })
  return schema.validate(body)
}


function validateRequests(body){
    const schema = Joi.object({
        name:Joi.string().required().label("Name"),
        email:Joi.string().required().label("Email"),
        phone:Joi.string().required().label("Phone number"),
        description:Joi.string().required().label("Description")
    })

    return schema.validate(body)
}

function validateDataSet(body){
    const schema = Joi.object({
        title:Joi.string().required().label("Dataset title"),
        description:Joi.string().required().label("Dataset description")
    })
    return  schema.validate(body)
}

function validateProject(body){
    const schema = Joi.object({
        title:Joi.string().required().label("Project title"),
        description:Joi.string().required().label("Project description")
    })
    return  schema.validate(body)
}


function validatePaper(body){
    const schema = Joi.object({
        file:Joi.string().required().label("Paper file"),
        heading:Joi.string().required().label("Paper heading")
    })
    return schema.validate(body)
}

const Questionnaire = mongoose.model("Questionnaire",questionaireSchema)



module.exports.Questionnaire = Questionnaire
module.exports.validateQuestionnaire = validateQuestionnaire
module.exports.validateRequests = validateRequests
module.exports.Request = Request
module.exports.DataSet = DataSet
module.exports.validateDataSet = validateDataSet
module.exports.Project = Project
module.exports.validateProject = validateProject
module.exports.Paper = Paper 
module.exports.validatePaper = validatePaper