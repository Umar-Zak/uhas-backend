// This module is the entry point of the app.

// importing third party modules(libraries) need for this module
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const config = require("config")
const mongoose = require("mongoose")
const endpoints = require("./routes/endpoints")

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
const PORT = process.env.PORT || 4200

// The app server listening to connections below
app.listen(PORT,()=>{ 
    console.log(`App listening on port ${PORT}`)
})