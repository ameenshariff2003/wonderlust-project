const User = require("../models/user.js")

module.exports.renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
}
//signup for
module.exports.Signup =async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const register = await User.register(newUser, password);
        console.log(register);
        req.login(register,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to wonderlust");
            res.redirect("/listings");
        });
       
    } catch (error) {
        console.error(error);
        req.flash("error",error.message)
        res.redirect("/signup");
    }
}

//login form
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
   }

//post login form
module.exports.Login =  async(req,res)=>{
    req.flash("success","Welcome back");
   let redirectUrl =  res.locals.redirectUrl||"/listings";
   res.redirect(redirectUrl);

}


//logout
module.exports.userlogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success","You are successfully logged out");
        res.redirect("/listings");
    })
}