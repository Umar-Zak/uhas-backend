const mongoose = require("mongoose")
const JOI = require("joi")


const questionaireSchema = mongoose.Schema({
    officer:{type:mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true}
    })},
    collected_on:{type:Date, default:new Date()},
    data:{type:[]},
    patient:{type:mongoose.Schema({
        id:{type:String,required:true},

    })}
})


function validateQuestionnaire(body){
  const schema = JOI.object({
      patient:JOI.string().required().label("Mother's ID"),
      data:JOI.array().min(1).required()
  })
  return schema.validate(body)
}


const Questionnaire = mongoose.model("Questionnaire",questionaireSchema)



module.exports.Questionnaire = Questionnaire
module.exports.validateQuestionnaire = validateQuestionnaire