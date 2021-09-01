const jwt = require("jsonwebtoken");
const auth = async (req,res,next)=>{
    try {
        const {token} = req.query
        // const check = req.cookies.token
        // console.log(check)
        const verifyUser = jwt.verify(token,"secret_this_should_be_longer")
        next()
    }
    catch (err) {
        res.status(401).send(err)
    }
}
module.exports = auth;