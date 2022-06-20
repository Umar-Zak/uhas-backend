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
    //     question: `GPS coordinate of Food outlet`,
    //     section: "C",
    //     title: "FOOD PROVISION/RETAIL OUTLET MAPPING PROXIMAL TO SCHOOLS",
    //     options: [
    //         // {
    //         //     type: "radio",
    //         //     value: "Yes"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "No"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Both self and assisted service"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Food stall/stand"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Tabletop"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Restaurant"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Chop bar"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Cold store’"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Chain/ Franchising"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Individual"
    //         // },
    //         // {
    //         //     type: "radio",
    //         //     value: "Partnership"
    //         // },
    //         {
    //             type: "text",
    //             value: "Coordinates"
    //         },
    //     ]
    // })

    // await question.save()
    // console.log(question)
})