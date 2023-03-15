var express = require('express');
var router = express.Router();
const controller = require("../controller/userController")
const Auth = require('../middleware/authmiddleware');
/* ** All Routers come Come before it / users ** */
const path = require("path")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , './upload/users/')
    },
    filename:function(req,file,cb){
        const fileName = Date.now() + "-" + Math.round(Math.random() * 100) +"-"+ file.originalname.replace(" ",'').replace("  ",'') ;
        cb(null,fileName)
    },
    
})
const fileFilter = function(req,file,cb){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg'){
        cb(null , true)
    }else{
        cb(new Error('Invalid file format Only image/jpeg and image/png and image/gif'))
    }
}

const upload = multer({storage , fileFilter}).single('src');

// Create a new user
router.post('/create',controller.Create_Account);
// Login user
router.post("/login" , controller.Login_Account);
// Edit user account 
router.put("/edit" ,upload,Auth.verify, controller.Edit_Account);
// Return user account
router.post("/me" ,Auth.verify, controller.me);

//Return profile
router.get("/profile/:id" , controller.profile);
// Return user avatar
router.post("/avatar" , controller.getAvatar);
router.get("/upload/avatar/:id" , (req,res,next)=>{
    try{
        const ph = path.join(__dirname , '../upload/users/')
        res.sendFile(ph + req.params.id)
    }catch(err){
        res.status(200).send("")
    }
});



module.exports = router;
