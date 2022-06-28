// This module is the entry point of the app.

// importing third party modules(libraries) need for this module
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const config = require("config")
const mongoose = require("mongoose")
const endpoints = require("./routes/endpoints")
const questionsRoute = require("./routes/questions")
const {Question}  = require("./model/Questions")
// Instantiating the app server below
const app = express()

// connecting to the database server below
mongoose.connect(config.get("db"))
.then(res=>console.log("Connected"))
.catch(err=>console.log("Error connecting",err))

// Making use of middlewares and route handlers below
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use("/api",endpoints)
app.use("/api/second", questionsRoute)
const PORT = process.env.PORT || 4200

// The app server listening to connections below
app.listen(PORT, async    () => { 
    console.log(`App listening on port ${PORT}`)
    // const question = new Question({
    //     question: `Are there disposal mechanisms for menstrual hygiene waste at the school?`,
    //     section: "H",
    //     title: "Assessment of School’s Water, sanitation and hygiene (WASH) situations in Schools (Adapted from UNHCR and GES checklist for Schools)",
    //     options: [
    //         {
    //             type: "radio",
    //             value: "Yes"
    //         },
    //         {
    //             type: "radio",
    //             value: "No"
    //         },
    //         // {
    //         //     type: "radio",
    //         //     value: "MHM education"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Openly dumped on premises"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Pit latrine without slab/open"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Bucket "
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Hanging toilet/latrine"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "None"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Surface water (River/Lake/Canal)"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "No water sources"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Bakery"
    //         // },
    //         // {
    //         //     type: "text",
    //         //     value: "Others(specify)"
    //         // },
    //     ]
    // })

    // await question.save()
    // console.log(question)
})