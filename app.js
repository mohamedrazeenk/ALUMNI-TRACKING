const port = process.env.PORT || 4000;

var exp = require("express");

var app = exp();

var bp = require("body-parser");

var passport = require("passport");

var session = require('express-session');

var flash = require('req-flash');

var mang = require("mongoose");

var user  = require("./models/usermodel");

var passportConfig = require("./config");

passportConfig(passport);

app.use(exp.static("public"));

app.use(bp.urlencoded({extended: true}));

app.set("view engine","ejs");




mang.connect("mongodb+srv://kavin1:kavin1@cluster0-htry7.mongodb.net/alumni?retryWrites=true&w=majority",{ useNewUrlParser: true , useUnifiedTopology: true});




app.use(session({

    secret : "Im ok",

    resave : false,

    saveUninitialized : false

}));

app.use(flash());




app.use(passport.initialize());

app.use(passport.session());

// app.get("/",function(req,res){

//     res.render("landing");

// })










app.use((req,res,next)=>{

    res.locals.currentUser  =  req.user;

    res.locals.logError     =  req.flash("logError");

    res.locals.regError     =  req.flash("regError");

    res.locals.success      =  req.flash("success");

    next();

});

app.get("/",function(req,res){

    res.render("landing");

})

app.get("/alumni/register",function(req,res){

     //console.log(req.flash("regError"));

     res.render("alumni/register");

    // if(req.user.group==="Alumni")

    //     res.render("/alumni/profile");

    // else if(req.user.group==="Admin")

    //     res.render("admin/profile");    




})

app.get("/admin/register",function(req,res){

    res.render("admin/register");

})




app.get("/profile",function(req,res){

    if(req.user.group==="alumni")

         res.redirect("/alumni/profile")

    else if(req.user.group==="admin")

         res.redirect("/admin/profile")    

})










app.post("/register",passport.authenticate("local-register",{

    successFlash : true,

    successRedirect : "/profile",

    failureFlash : true,

    failureRedirect : "back"

}))




app.get("/logout",function(req,res){

    req.logout();

})




app.get("/login",function(req,res)

{

    res.render("login")

})

app.post("/login",loggedIn,passport.authenticate("local-login",{

    successRedirect:"/profile",

    failureRedirect:"back"

}))

app.get("/alumni/profile",function(req,res){

    res.render("alumni/profile",{user:req.user});

})

app.get("/admin/profile",function(req,res){

    res.render("admin/profile",{user:req.user})

})

app.get("/alumni/jobdetails",function(req,res){

    res.render("alumni/jobdetails",{user:req.user});

})

app.get("/logout",function(req,res)

{

    req.logout();

    res.redirect("/");

})

function loggedIn(req,res,next)

{

    if(req.isAuthenticated())

    {

        return next();

    }

    res.redirect("/login")

}




app.listen(2000)