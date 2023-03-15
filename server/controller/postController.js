const Post = require("../module/posts");
const User = require("../module/users");
const fs = require("fs")
const path = require("path")
// Create a new Post 
exports.Create_Post = (req,res,next)=>{
    const Data = {
        title:req.body.title,
        src:req.file.filename,
        author:req.user.id
    }
    Post.create(Data).then(post =>{
        User.findById(req.user.id).then(user=>{
            if(req.body.title !== ''){
                if(req.file){
                    user.posts.push(post._id);
                    user.save();
                }else{
                    res.status(404).send("Upload img please")
                }
            }
        })
        res.send("Done")
     })
     .catch(err =>{
         res.send("ERROR CREATE")
     })
    
}
// Show Post Detils
exports.Show_Post = (req,res,next)=>{
    Post.findById(req.params.id)
    .populate("author" , 'name avatar id')
    .populate("comments.author" , 'name avatar id')
    .then(post =>{
        res.send(post)
    }).catch(err =>{
        res.status(404).send(err)
    })
}

// Edit a Post
exports.Edit_Post = (req,res,next)=>{
    Post.findByIdAndUpdate(req.params.id)
   .then(post =>{
        if(post.author._id.toString() === req.user.id.toString()){
            if(req.body.title !==''){
                post.title = req.body.title;
                res.send("Done")
                post.save();
                next();
            }else{
                res.send("please enter a title")
            }
        
        }else{
            console.log("You not have access to edit or remove this post")
        }
   })
}
// Delete a Post
exports.Delete_Post = (req,res,next)=>{
    Post.findByIdAndDelete(req.params.id)
    .then(post =>{
         if(post.author._id.toString() === req.user.id.toString()){
             res.send("Done")
             next();
         }else{
             console.log("You not have access to edit or remove this post")
         }
    })
}
// Get all Posts
exports.All_Posts = (req,res,next)=>{
    Post.find()
    .populate('author' , 'name avatar id')
    .populate("comments.author" , 'name avatar id')
    .then(posts =>{
        res.send(posts)
    }).catch(err =>{
        res.send(err)
    })
}

// Like for post
exports.Like_Post = (req,res,next)=>{
    Post.findById(req.params.id)
  .then(post =>{
        if(post.likes.filter(like => like.user.toString() === req.user.id.toString()).length === 0){
            post.likes.unshift({
                user:req.user.id
            })
            res.send({msg:"Done", data:post.likes})
            post.save();
            next();
        }else{
            res.send({msg:"Already Liked"})
        }
    }).catch(err =>{
        res.status(404).send({msg:"Error"});
    })
}
// deslike for post
exports.Deslike_Post = (req,res,next)=>{
    Post.findById(req.params.id)
 .then(post =>{
        if(post.likes.filter(like => like.user.toString() === req.user.id.toString()).length > 0){
            post.likes = post.likes.filter(like => like.user.toString()!== req.user.id.toString())
            res.send({msg:"Done", data:post.likes})
            post.save();
            next();
        }else{
            res.send({msg:"Already Disslike"})
        }
    }).catch(err =>{
        res.status(404).send({msg:"Error"});
    })
}

// Create comment for post
exports.Create_Comment = (req,res,next)=>{
    Post.findById(req.body.id)
    .populate("comments.author" , 'name avatar id')
    .then(post =>{
            if(req.body.comment !==''){
                post.comments.unshift({
                    comment:req.body.comment,
                    author:req.user.id
                })
                res.send({msg:"Done" , data:post.comments})
                post.save();
                next();
            }else{
                res.send({msg:"please enter a comment"})
            }
    }).catch(err =>{
        res.status(404).send({msg:"Error"});
    })
}