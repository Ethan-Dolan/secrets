//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser : true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }else{
            console.log(err);
        }
    })
})

app.post("/login", (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err,result)=>{
        if(!err){
            if(result){
                if(result.password === password){
                    res.render("secrets");
         
                }else{
                    console.log("Password not match");
                }
            }else{
                console.log("User not found");
            }
        }else{
            console.log(err);
        }
    })
})

app.listen("3000",(req,res)=>{
    console.log("Successfully started the port on 3000");
})