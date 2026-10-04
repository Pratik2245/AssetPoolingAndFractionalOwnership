import User from "../../../../models/User";
import Portfolio from "../../../../models/Portfolio"
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");

export async function POST(req, res) {
  try {
    const body = await req.json();
    // console.log(body);
    const { pid } = body;
    await connectDB();
    const portfoliodata = await Portfolio.findOne({ _id: pid });
    // console.log(portfoliodata);
    return NextResponse.json({ status: 200, error: portfoliodata });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300, error: "check internet connection" });
  }
}
