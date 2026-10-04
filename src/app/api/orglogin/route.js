import Admin from "../../../models/Admin";
import connectDB from "../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
import {cookies} from 'next/headers'


export async function POST(req, res) {
  try {
    const body = await req.json();
    await connectDB();
    if(body.email!=""||bpdy.password!="")
    {
    const user = await Admin.findOne({ email: body.email });
    var role=user.role;
    const bytes = CryptoJS.AES.decrypt(user.password, "secretkey123");
    const decryptpass = bytes.toString(CryptoJS.enc.Utf8);
    if (user) {
      if (body.email===user.email && decryptpass === body.password) {
        var token = jwt.sign({ name:user.name,email:user.email,address:user.address,pincode:user.pincode,phone:user.phone,role:user.role }, 'jwttoken',{expiresIn: '2days'});
        cookies().set("role",role)
        return NextResponse.json({ status: 200,token , message: "success"});
      } else {
        return NextResponse.json(
          { status: 201 },
          { message: "Invalid Credentials" }
        );
      }
    } else {
      return NextResponse.json({ status: 400 }, { message: "User not found" });
    }}
    else{
      throw new Error("Enter All Fields");
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300 }, { error: error.message });
  }
}
