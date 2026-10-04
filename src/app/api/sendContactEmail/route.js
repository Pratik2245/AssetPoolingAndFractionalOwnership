import nodemailer from "nodemailer";
import User from "../../../models/User";
import connectDB from "../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");


export async function POST(req, res) {

    if (req.body) {
        try {
            const body = await req.json();
            console.log(body);
            const { email, subject, message } = body
            if (email && subject && message) {
                await connectDB();

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'hrushitech51@gmail.com',
                        pass: 'twzv uqed jlct rjsl'
                    }
                });

                try {
                    // Send the email
                    transporter.sendMail({
                        from: { email },
                        to: "hrushitech51@gmail.com",
                        subject: `hello ${email}`,
                        text: "hello",
                        html: `<html> <head> <style type="text/css" > .container{display: flex; flex-direction: column; justify-content: center; align-items: center ; padding: 2rem; } img{height: 70px; width: 170px; } </style> </head> <body> <div class='container'> <img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn3d.iconscout.com%2F3d%2Fpremium%2Fthumb%2Fcolor-plate-4034565-3337294%400.png%3Ff%3Dwebp&tbnid=LVafsAHPb3fdXM&vet=12ahUKEwju97CnmrmDAxX6s2MGHVT-AyIQMygQegUIARCWAQ..i&imgrefurl=https%3A%2F%2Ficonscout.com%2F3d-illustrations%2Fcolor-plate&docid=zAOmlA_UILNE8M&w=450&h=450&q=color%20plate&ved=2ahUKEwju97CnmrmDAxX6s2MGHVT-AyIQMygQegUIARCWAQ" alt="bluechipart.com" /><br> <h1>New Message</h1> <br><div class="main"> <br><h2> Email:<h4>${email} </h4> </h2><h3>Subject:${subject}</h3> <p> <bold>Message</bold>:${message} </p> <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p> <p style="margin: 0;">Your Regard,</p> <br><p style="margin: 0;">BluechipArt.com</p> </div> </div> </body> </html>`,

                    });
                    return NextResponse.json({ status: 200, error: "success" });
                } catch (error) {
                    console.error("Error:", error);
                    return NextResponse.json({ status: 400, error: "failed" });
                }
            } else {
                return NextResponse.json({ status: 201, error: "Please Fill All Fields" });
            }
        } catch (error) {
            console.log(error);
            return NextResponse.json({ status: 300, error: "error" });
        }
    }
    else {
        return NextResponse.json({ status: 401, error: "Enter your email" });
    }
}