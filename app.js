// Filename - App.js

//=====================
// REQUIRES (INCLUDES)
//=====================
const express = require("express");
const session =require('express-session');//routing api library
const path=require('path');//include path library for combining path together
    
require('./database/db');   
const User = require("./model/User");
//============================
//SETUP EXPRESS
//============================

let app = express();

//Set up static file serving
app.use(express.static(path.join(__dirname,'public')));

app.set("view engine", "ejs");//setup view engine ejs
app.set('views', path.join(__dirname, 'views'));
var bodyParser=require('body-parser')//support data payload for post requests
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


//====================
//SETUP USER SESSION MIDDLEWARE
//====================
app.use(session({
  secret: 'chathaven-key',
  resave:false,
  saveUninitialized: true
}));

//=====================
// MAIN PAGE ROUTES
//=====================

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});



//=====================
// REST API FOR DATA
//=====================

//HTTP GET REQUEST TO RETIEVE USER
app.get("/api/user/:username", async function (req, res){
  user=await User.findOne({username: req.params.username});
  res.status(200).json(user);
});











//=====================
// AUTHENTICATE PAGE ROUTES
//=====================

// Showing home page
app.get("/", function (req, res) {
  res.render("home");
});

// Showing register form
app.get("/register", function (req, res) {
res.render("register");
});

// Handling user signup
app.post("/register", async (req, res) => {

const user = await User.findOne({username: req.body.username});
if(!user)
{
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    role: "NormalUser",
    channels:["HomeChannel", "ApeChannel"]
});
  return res.status(200).json(newUser);
}
else
{
  return res.status(403).json({error: "user already exists"});
}
});

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});
//Handling user login
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          req.session.user=req.body.username;
          console.log("Set Current Session variable:" +req.session.user)
          res.render("secret");
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});
//Handling user logout 
app.get("/logout", function (req, res) {
  console.log("Current session destroyed: "+ req.session.user)
  req.session,destroy()
  res.redirect('/');
    
});

//Function used to check if session is still valid
function isLoggedIn(req, res, next) {
  const sessionUser=req.sessionuser || 'No session set';
  if(req.session.user){
    console.log("Current session variable: "+sessionUser)
    return next();
  }
  console.log("Current session variable: "+sessionUser)
  if(req.url,include("api"))
  {
    res.status(401).json({error:"Unauthorized"});
  }
  else{
    res.redirect("/login");
  }
}

//=====================
// START SERVER LISTENER
//=====================
let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
