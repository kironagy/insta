const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Create New Module For Users
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:11
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    bio:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
}) 

userSchema.pre('save' , function(next){
    const user = this;
    if (this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function (err, salt) 
        {       
            if (err) 
            {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else 
    {
        return next();
    }
})

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

const User = mongoose.model('User',userSchema);
module.exports = User;