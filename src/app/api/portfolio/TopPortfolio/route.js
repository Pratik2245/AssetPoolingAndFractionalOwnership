// import User from "../../../../models/User";
import Portfolio from "../../../../models/Portfolio";
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    // console.log("allportflop")
    await connectDB();
    const portfoliodata = await Portfolio.find().sort({ BuyCount: -1 }).limit(3);
    portfoliodata.sort((a, b) => b.BuyCount - a.BuyCount);
    return NextResponse.json({ status: 200, error: portfoliodata });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300, error: "check internet connection" });
  }
}
