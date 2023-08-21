const User=require('../../routes/user');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
passport.use(new LocalStrategy(//calls function to use ie. local strategy
    {usernameField:'email'},//declares email as username
    async (email,password, done)=>{//function uses client-provided parameters to execute 
        try{
            const user=await User.findOne({email:email});//finds user in database with that email 
            if(!user){
                return done(null, false,{ //only called if user email not found in DB
                    message:'Email is not registered' 
                });
            }
            const isPasswordValid=await bcrypt.compare(password, user.password);//compares hashed pw's
            if(!isPasswordValid){//executed if hashed password doesn't match 
                return done(null,false,{message:'Incorrect password.'});
            }
            return done(null, user);//successful login, passes user to callback
        }catch(error){//error handling 
            return done(error);
        }
    }
));
function authcheck(req,res,next){//makes sure user logged in before showing routes
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/login');
    }
}
passport.serializeUser((user, done)=>{
    //serialize user's email 
    done(null, user.email);
});
passport.deserializeUser((email,done)=>{//deserializes user email 
    User.findOne({email:email},(err,user)=>{
        done(err, user);
    });
});
