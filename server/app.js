var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoClient = require("mongoose")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require("./routes/post")
const cors = require("cors")
require("dotenv").config();
var app = express();
app.use(cors({origin:'*'}))

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/posts", postsRouter);

// ** Connect Mongo Database
MongoClient.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4
    },
)
const db = MongoClient.connection;
db.on("error" , (err)=>{
    throw err
})
db.once("open" , ()=>{
    console.log("CONNECTED DB")
})

module.exports = app;
