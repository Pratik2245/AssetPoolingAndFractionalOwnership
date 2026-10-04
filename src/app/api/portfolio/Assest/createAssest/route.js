import Portfolio from "../../../../../models/Portfolio";
import User from "../../../../../models/User";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");
export async function POST(req, res) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      AType,
      Assest_Title,
      Assest_Price,
      Assest_Quantity,
      Assest_Description,
      PortfolioName,
    } = body.data;
    if(AType == null||
      Assest_Title== null||
      Assest_Price== null||
      Assest_Quantity== null||
      Assest_Description== null){throw new error("Please Fill All Feilds")}
      else{
    await connectDB();
    let pid = body.pid;
    const data = {
      AType,
      Assest_Title,
      Assest_Price,
      Assest_Quantity,
      Assest_Description,
      Date: new Date(),
    };
    let total = 0;
    const portfoliodata = await Portfolio.findOne({ _id: pid });
    if (portfoliodata.Price) {
      total = parseInt(portfoliodata.Price);
    }
    portfoliodata.Assests.push(data);
    total += parseInt(Assest_Price) * Assest_Quantity;
    console.log(total);
    const portfoliodataupdate = await Portfolio.updateOne(
      { _id: pid },
      { Assests: portfoliodata.Assests, Price: total }
    );
    console.log("assest added successfully");
    return NextResponse.json({ status: 200 }, { error: "success" });}
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300 }, { error: "error in addproduct" });
  }
}
