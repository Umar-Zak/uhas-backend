// importing third party modules needed for this module
const mongoose = require("mongoose")
const Joi = require("joi")


// This module(file) contains the schemas for the datase objects. 
//Each schema is explained below
 
           
           
         
// Below is the schema for the Questionare objects. 
// Objects in mongoDb is the same as a row of a table in SQL or MySQL
// Below represent how each object(row) is suppossed to be

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

// This the schema for the second questionaire. It follows the same pattern as the above

const secondQuestionaireSchema = mongoose.Schema({
    officer:{type:mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true}
    })},
    collected_on:{type:Date, default:new Date()},
    data:{type:[]},
})


// Below is the schema for the 'data request' feature.

const requestSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    description:{type:String,required:true},
    reason:{type:String,required:true}
})

// Below is the model for the 'data request' feature.
const Request = mongoose.model("Request",requestSchema)

// This is the 'dataset' feature schema.
const datasetSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true}
})

// Below is the model for the 'dataset' feature.
const DataSet = mongoose.model("DataSet",datasetSchema)

// Below is the 'add project' feature schema.
const projectSchema = mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true}
})

// Below represents the model for 'add project' feature.
const Project = mongoose.model("Project",projectSchema)


// Below is the 'upload paper work' schema.
const paperSchema = mongoose.Schema({
    file:{type:String,required:true},
    heading:{type:String,required:true},
    user:{type:String,required:true},
    date:{type:Date, default:new Date()},
    type:{type:String,required:true,default:"faculty"},
    isApproved:{type:Boolean, default:true}
})

// This is the 'paper work'  model.
const Paper = mongoose.model("Paper",paperSchema)


// This is the 'upload zip' feature schema.
const zipSchema = mongoose.Schema({
    file:{type:String,required:true},
    day_posted:{type:Date,default: new Date()}
})

// Below is the 'upload zip' model
const Zip = mongoose.model("Zip",zipSchema)

//Below is the function that validates the form the user
// fills when taking the first questionnaire
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

// Below is the function that validates and makes sure the second questionnaire
// is properly taken before submitted
function validateSecondQuestionnaire(body){
    const schema = Joi.object({
        data:Joi.array().min(1).required().label("Questionnaire"),
         
    })
    return schema.validate(body)
  }
  
// Below is the function that validates the form a user
// fills when requesting for data
function validateRequests(body){
    const schema = Joi.object({
        name:Joi.string().required().label("Name"),
        email:Joi.string().required().label("Email"),
        phone:Joi.string().required().label("Phone number"),
        description:Joi.string().required().label("Description"),
        reason:Joi.string().required().label("Reason for request")
    })

    return schema.validate(body)
}

// Below is the  function that validates the form an admin
// fills when adding a dataset
function validateDataSet(body){
    const schema = Joi.object({
        title:Joi.string().required().label("Dataset title"),
        description:Joi.string().required().label("Dataset description")
    })
    return  schema.validate(body)
}


// Below is the function that validates the form an admin
// fills when adding a projects
function validateProject(body){
    const schema = Joi.object({
        title:Joi.string().required().label("Project title"),
        description:Joi.string().required().label("Project description")
    })
    return  schema.validate(body)
}

// This is the function that validates the form an admin
// fills when uploading a paperwork
function validatePaper(body){
    const schema = Joi.object({
        file:Joi.string().required().label("Paper file"),
        heading:Joi.string().required().label("Paper heading"),
        type:Joi.string().required().label("Paper type"),
        author:Joi.string().required().label("Author")
    })
    return schema.validate(body)
}


// This is the function that validates the form an admin
// fills when uploading a paperwork
function validateZip(body){
    const schema = Joi.object({
        file:Joi.string().required().label("Zip file")
    })
    return schema.validate(body)
}

// The below code are instantiating the questionnaire and second questionnaire models
const Questionnaire = mongoose.model("Questionnaire",questionaireSchema)
const SecondQuestionaire = mongoose.model("SecondQuestionaire",secondQuestionaireSchema)


// The below code exports the various pieces to be accessible in other modules(files)
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
module.exports.Zip = Zip
module.exports.validateZip = validateZip
module.exports.SecondQuestionaire = SecondQuestionaire
module.exports.validateSecondQuestionnaire = validateSecondQuestionnaire