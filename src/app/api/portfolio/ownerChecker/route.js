import User from "../../../../models/User";
import Portfolio from "../../../../models/Portfolio"
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");

export async function POST(req, res) {
    try {
        const body = await req.json();
        console.log(body);
        const { email, pid } = body;
        await connectDB();
        const userdetails = await User.findOne({ email: email });
        const portfoliodata = await Portfolio.findOne({ _id: pid });
        // console.log(portfoliodata);
        if (portfoliodata.userId == userdetails._id) {
            console.log("if")
            return NextResponse.json({ status: 200, error: "admin" });
        }
        else {
            console.log("else")
            return NextResponse.json({ status: 200, error: "invalid" })
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}
