const JWT = require("jsonwebtoken");
const expiresIn = '1d'
exports.Sign = (payload)=>{
    return JWT.sign(payload , process.env.SECRET_KEY , { expiresIn })
}
exports.verify = (req,res,next)=>{
    const token = req.headers['authorization'];
    try{
        const decoded =  JWT.verify(token , process.env.SECRET_KEY)
    req.user = decoded;
    }catch(err){
        return res.status(401).json({message: "Invalid Token"})
    }
    next();
}   
