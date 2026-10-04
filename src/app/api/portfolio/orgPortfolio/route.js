import User from "../../../../models/User";
import Portfolio from "../../../../models/Portfolio"
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");

export async function POST(req, res) {
    try {
        const body = await req.json();
        // console.log(body);
        const { email } = body;
        await connectDB();
        const userdetails = await User.findOne({ email: email });
        // console.log(userdetails)
        const portfoliodata = await Portfolio.find({ userId: userdetails._id });
        // console.log(portfoliodata);
        return NextResponse.json({ status: 200, error: portfoliodata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}
