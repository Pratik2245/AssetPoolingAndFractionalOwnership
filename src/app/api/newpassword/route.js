import User from "../../../models/User";
import connectDB from "../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
import {cookies} from 'next/headers'


export async function POST(req, res) {
  try {
    
    const body = await req.json();
    console.log(body)
    if(body.email!=""||body.password!="")
    {
      await connectDB();
      const user = await User.findOne({ email: body.email });
      const encryptpass = CryptoJS.AES.encrypt(body.password, "secretkey123").toString()
      
    if (user) {
      let upuser = await User.findOneAndUpdate({ email: body.email },{password:encryptpass});
        return NextResponse.json({ status: 200, message: "success"});
    } else {
      return NextResponse.json({ status: 400 }, { message: "User not found" });
    }}
    else{
      throw new Error("Enter All Fields");
    }
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ status: 300  , message: error.message });
  }
}
