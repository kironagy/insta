var express = require('express');
var router = express.Router();
const controller = require("../controller/postController");
const Auth = require("../middleware/authmiddleware");
const fs = require("fs")
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , './upload/posts/')
    },
    filename:function(req,file,cb){
        const fileName = Date.now() + "-" + Math.round(Math.random() * 100) +"-"+ file.originalname.replace(' ','').replace("  ",'') ;
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


// Get All posts
router.get("/all" , controller.All_Posts);
//Create a new post
router.post("/create" , upload , Auth.verify, controller.Create_Post);
// Show post details
router.post("/:id", controller.Show_Post);
// add comment
router.put("/comment"  , Auth.verify, controller.Create_Comment);
// Update post
router.put("/edit/:id" ,Auth.verify, controller.Edit_Post);
// delete post
router.delete("/delete/:id",Auth.verify, controller.Delete_Post);
router.post("/like/:id",Auth.verify, controller.Like_Post);
router.post("/deslike/:id",Auth.verify, controller.Deslike_Post);

router.get("/upload/posts/:id" , (req,res,next)=>{
    const ph = path.join(__dirname , '../upload/posts/')
    res.sendFile(ph + req.params.id)

})

module.exports = router;