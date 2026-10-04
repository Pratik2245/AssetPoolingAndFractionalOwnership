import nodemailer from "nodemailer";
import User from "../../../models/User";
import connectDB from "../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");


export async function POST(req, res) {

  if(req.body){
  try {
    const body = await req.json();
    console.log(body);
    await connectDB();

    const user = await User.findOne({ email: body });
    if (user) {

    //   function generateP() {
    //     var pass = '';
    //     var str = '1234567890';
          
    //     for (let i = 1; i <= 6; i++) {
    //         var char = Math.floor(Math.random()
    //                     * str.length + 1);
              
    //         pass += str.charAt(char)
    //     }
          
    //     return pass;
    // }

    const otp=Math.round((Math.random()*10000000)/10).toString();

    const encryptotp=CryptoJS.AES.encrypt( otp,"secretkey123").toString()
    // const user = await User.findOneAndUpdate({email:body},{password:decryptpass})


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:587,
        secure:false,
        auth: {
            user: 'hrushitech51@gmail.com',
            pass: 'twzv uqed jlct rjsl'
        }
    });

      try {
        // Send the email
        transporter.sendMail({
          from: "hrushitech@gmail.com",
          to: {body},
          subject: `hello ${body}`,
          text: "hello",
          html:`<html> <head> <style type="text/css" > .container{ display: flex; flex-direction: column; justify-content: center; align-items: center ; padding: 2rem; } img{ height: 70px; width: 170px; } </style> </head> <body> <div class='container'> <img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn3d.iconscout.com%2F3d%2Fpremium%2Fthumb%2Fcolor-plate-4034565-3337294%400.png%3Ff%3Dwebp&tbnid=LVafsAHPb3fdXM&vet=12ahUKEwju97CnmrmDAxX6s2MGHVT-AyIQMygQegUIARCWAQ..i&imgrefurl=https%3A%2F%2Ficonscout.com%2F3d-illustrations%2Fcolor-plate&docid=zAOmlA_UILNE8M&w=450&h=450&q=color%20plate&ved=2ahUKEwju97CnmrmDAxX6s2MGHVT-AyIQMygQegUIARCWAQ" alt="bluechipart.com" /> <h1>Reset your password</h1> <div class="main"> <p> We received a request to reset your password. </p> <h3>OTP:${otp}</h3> <p> Please use the above password to login to your account and change your password from Myaccount section </p> <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p> <p style="margin: 0;">Your Regard,</p> <p style="margin: 0;">BluechipArt.com</p> </div> </div> </body> </html>`,

        });

        console.log("Password reset email sent to:"+body);
        return NextResponse.json({ status: 200, error: "success",otp:encryptotp });
      } catch (error) {
        console.error("Error sending password reset email:", error);
        return NextResponse.json({ status: 400, error: "failed" });
      }
    } else {
      return NextResponse.json({ status: 201, error: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300, error: "error" });
  }
}
else{
  return NextResponse.json({ status: 401, error: "Enter your email" });
}
}
