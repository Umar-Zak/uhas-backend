// importing third party modules(libraries)needed here
const config = require("config")
const jwt = require("jsonwebtoken")

// Exporting a function that validates a user to make sure they are logged in
// before accessing protected resources or else they are redirected
module.exports = (req,res,next)=>{
    const token = req.header("x-auth-token")
    if (!token) return res.status(401).send("You need to log in")
    try {
        const user = jwt.verify(token,config.get("key"))
        req.user = user
        next()
    } catch (error) {
        res.status(400).send("Invaalid auth token")
    }
}