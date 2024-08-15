if(process.env.NODE_ENV != "production"){
    require('dotenv').config()

}


//console.log(process.env.SECRET)


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const user = require("./routes/user.js")



//const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;

//calling the main fn 

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

//connecting to the db
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,   //We are assigning the Mongodb Atlas URL
    crypto : {
        secret : process.env.SECRET,  //We have to use crypto for the sensitive information and the secret is same as the session secret
    },
    touchAfter:24*3600,
});
 
store.on("error",()=>{
    console.log("ERROR in Mongo session srt",err)
})
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    //setting expiry dateof cookie
    cookie : {
        //suppose we want sessin to expir after seven days we hve to give in millisecond
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true,

    },

};


//basic root api
// app.get("/",(req,res)=>{
//     res.send("hi iam base root");
// });

// mongo session



app.use(session(sessionOption));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//authenticate is static method which is default by mangoos for the authntication of signup and login
passport.serializeUser(User.serializeUser());
//User related data is stored in session is serialisation and removing the user related data from session is deserialize
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    const success = req.flash("success");
    const error = req.flash("error");
    res.locals.success = success;
    res.locals.error = error;
    res.locals.currUser = req.user;
    next();
})
app.use("/listings",listings)
app.use("/listings/:id/reviews/",reviews)
app.use("/",user);

//this is set  for the all unauthorize routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
//this send the actual err as response
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
  //  res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err})
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");

});
