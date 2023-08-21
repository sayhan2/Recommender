const express=require('express');
const passport=require('passport');
const session=require('express-session');
const app=express();
const router=express.Router();
const config=require('./config');
const secretKey=process.env.SECRET_KEY||config.secretKey;
app.use(session({//set up session middleware
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge:3600000//creates session time limit(hour)
    }
}));
//initialize Passport.js and session
app.use(passport.initialize());
app.use(passport.session());
//other middleware and route setup
//login route
app.post('/login', passport.authenticate('local',{
    successRedirect:'/dashboard',//redirect on successful login
    failureRedirect:'/login',//redirect on failed login
    failureFlash:true,
}), 
async (req,res)=>{
    try{
        const email=req.body.email;
        const user=await User.findOne({email});
        if(!user){
            console.error('User not found');
        }else{
            if(user.isLocked){//account locked error message
                return res.status(403).render('locked account',{message:'Your account is temporarily locked due to multiple failed login attempts. Please try again later or reset your password.' });
            }else{
                const isPasswordValid=await bcrypt.compare(req.body.password, user.password);
                if(isPasswordValid){//handles valid credentials case
                    req.login(user,(err)=>{
                        if (err){
                            console.error('Login error:',err);
                            return res.status(500).json({message:'Internal server error' });
                        }
                        req.login(user, function(err) {
                            if (err){
                                console.error('Login error:',err);
                                return res.status(500).json({ message: 'Internal server error' });
                            }
                            //user data stored
                            return res.redirect('/dashboard'); //redirect the user to the dashboard or other page
                        });
                    });
                }else{
                    user.failedAttempts+=1;//counts failed credential attempts
                    if (user.failedAttempts>=MAX_FAILED_ATTEMPTS){//if case fulfilled, account locked
                        user.isLocked=true;
                    }
                    await user.save();//handle failed login scenario (e.g., show login error message)
                    return res.status(401).render('login', { message: 'Invalid email or password' });
                }
            }
        }
    }catch(error){
        console.error('Login error:',error);
        return res.status(500).json({message:'Internal server error'});
    }
});
//logout route
app.get('/logout', (req, res) => {
    req.logout();//terminates session
    res.redirect('/login'); //redirects to login(can change)
});
router.post('/resetPassword',async(req,res)=>{
    try{//reset pw route 
        const {token,newPassword}=req.body; //need frontend for this 
        const user=await User.findOne({
            resetToken:token,//validates that appropriate user is making request 
            resetTokenExpires:{$gt:Date.now()}//makes sure credentials/token match
        });
        if (!user){
            return res.status(400).json({message:'Token not valid'});
        }
        const salt=await bcrypt.genSalt(10);//hashes new password and assigns to user in database
        const hashedPassword=await bcrypt.hash(newPassword, salt);
        user.password=hashedPassword;//only executes if token is valid 
        user.resetToken=null;
        user.resetTokenExpires=null;
        await user.save();
        return res.status(200).json({ message: 'Password reset successful.' });
    } catch (error){
        console.error('Error resetting password:',error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
