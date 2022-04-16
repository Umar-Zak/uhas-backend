
// exporting the common function that validates the body of every form submitted to the 
// api
module.exports = validator =>{
    return (req,res,next)  => {
    const { error} = validator(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    next()

    }
}