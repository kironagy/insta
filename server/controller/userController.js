const User = require("../module/users");
const Auth = require('../middleware/authmiddleware')
const CreateError = require("http-errors")
// Create a new User
exports.Create_Account = (req,res,next)=>{
    const Data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        avatar:"avatar.png"
    }
    User.create(Data).then(data =>{
        const user = {
            id:data.id,
            name:data.name,
            email:data.email,
        }
        const token = Auth.Sign(user)
        res.send({id:user.id,token})
    }).catch(err =>{
        res.send(err)
    })
}
// Login User
exports.Login_Account = (req,res,next)=>{
    const Data ={
        email:req.body.email,
        password:req.body.password
    }
    User.findOne({email : Data.email}).then(data =>{
        if(!data){
            res.send("User not found")
        }else{
            if(data.validPassword(Data.password)){
                const user = {
                    id:data.id,
                    name:data.name,
                    email:data.email,
                }
                const token = Auth.Sign(user)
                res.send({id:data.id,token})
            }else{
                res.send("password is invalid")
            }
        }
        
    }).catch(err =>{
        res.send(err)
    })
}
// Edit User for profile
exports.Edit_Account = (req,res,next)=>{
    User.findByIdAndUpdate(req.user.id).then(user =>{
        try{
            if(req.body.name !==''){
                user.name = req.body.name;
                if(req.body.bio){
                    user.bio = req.body.bio;
                }
                if(req.file){
                    user.avatar = req.file.filename;
                }
                res.send("DONE");
                user.save();
            }else{
                CreateError(401 , 'Please Enter Name')
            }
        }catch(err){
            CreateError(404 , 'ENTER NAME')
        }
        return next();
    })
}

// Dont Remember Password and Change
exports.Change_Password_Account = (req,res,next)=>{

}

exports.profile = (req,res,next)=>{
    User.findById(req.params.id)
    .populate("posts" , 'title src create_at likes comments')
    .then(user=>{
        const data ={
            id:user.id,
            name:user.name,
            avatar:user.avatar,
            bio:user.bio,
            posts:user.posts,
        }
        res.send(data);
    }).catch(err =>{
        res.status(404).send("This Account Not Found")
    })
}
exports.getAvatar = (req,res,next)=>{
    User.findOne({_id:req.body.id}).then(user =>{
        if(user){
            res.send({avatar:user.avatar});
        }else{
            res.send("User not found")
        }
    }).catch(err =>{
        res.send("User not found")
    })
}
// Return User Account
exports.me = (req,res,next)=>{
    res.send(req.user)
}
