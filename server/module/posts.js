const mongoose = require('mongoose');

// Create a new module for posts

const Comments = {
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type:String,
        required:true
    },
    create_at:{ 
        type:Date,
        default:Date.now,
    }
}
const postSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    src:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        // required:true
    },
    likes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ],
    comments:[
        Comments
    ],
    create_at:{ 
        type:Date,
        default:Date.now,
    }
})

const Post = mongoose.model("Post" , postSchema);
module.exports = Post;