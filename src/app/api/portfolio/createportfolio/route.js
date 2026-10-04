import User from "../../../../models/User";
import Portfolio from "../../../../models/Portfolio"
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { pname, email, Assests } = body;
    if (pname && email && Assests.length > 0) {
      await connectDB();
      const userdetails = await User.findOne({ email: email });
      let total = 0;
      for (let i = 0; i < Assests.length; i++) {
        console.log(Assests[i].Assest_Price)
        total += parseFloat(Assests[i].Assest_Price) * parseFloat(Assests[i].Assest_Quantity);
      }
      let data = { Price: total, date: new Date().toUTCString() }
      await Portfolio.create({ userId: userdetails._id, Assests: Assests, PortfolioName: pname, Price: total, PortfolioPrice: [{ date: new Date(), Price: total }], RemainingPrice: total, PercentageRemaining: 100, BuyCount: 0 })
      console.log("portfolio create successfully")
      return NextResponse.json({ status: 200 }, { error: "portfolio create successfully" });
    } else {
      throw new Error("Fill All Fields")
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300, message: error.message });
  }
}
