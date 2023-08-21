nodemailer=require('nodemailer');
bcrypt=require('bcrypt');
require('dotenv').config();
express=require('express');
const GenToken=require('./token');
const transporter=nodemailer.createTransport({//creates transport to send email
    service:'Gmail',
    auth:{
        user:process.env.Email_USER, 
        pass:process.env.Email_PASS
    }
});
async function emailcheck(email){ //email checking function for pw reset 
    try{
        const user=await User.findOne({email: email});//searches email in DB
        return !!user;//!! booleanifies user search result 
    }catch(error){
        console.error('Error checking email existence:', error);
        return false;
    }
}
app.post('/forgotPassword', async (req, res)=>{
    const email = req.body.email;
    if (!email){
        return res.status(400).json({message:'email: '});
    }
    try{
        const emailExists=await emailcheck(email);
        if (!emailExists){
            return res.status(404).json({message:'Email not found'});//error handling
        }
        const resetToken=GenToken();
        const user=await User.findOne({email:email});
        if (user){
            user.resetToken=resetToken;
            user.TokenExpiration=Date.now()+3600000;//assigns 1hr expiration for token
            await user.save();//saves to user variable 
            const mailOptions={
                from: 'sayhanazam@email.com',
                to: email,
                subject: 'Password Reset',
                html: `password reset token: ${resetToken}`
            };    //mails token to user
            transporter.sendMail(mailOptions,(error,info) => {
                if (error){
                    console.error('Error sending email:', error);
                    return res.status(500).json({ message:'Error sending email' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.status(200).json({ message: 'Reset token generated and email sent successfully' });
                }
            });
        }else{
            return res.status(404).json({ message: 'email not registered' });
        }
    }catch(error){
        console.error('Error generating and storing reset token:', error);//error handling if tokengen screws up
        return res.status(500).json({message:'Internal server error'});
    }
});
module.exports={
    emailcheck,
    transporter
};

