import Portfolio from "../../../../../models/Portfolio";
import User from "../../../../../models/User";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");
export async function POST(req, res) {
  try {
     const body = await req.json();
    const { 
        AType,
      Assest_Title,
      Assest_Price,
      Assest_Quantity,
      Assest_Description,
      PortfolioName,
      pid } = body;
    await connectDB();
    
    let total = 0;
    const portfoliodata = await Portfolio.findOne({ _id: pid });
    let price=0;
    let updateddata=[];
    portfoliodata.Assests.map((e)=>{ if(e.Assest_Title!=Assest_Title){
        price=price+e.Assest_Price;
        updateddata.push(e)}})
    console.log(updateddata)

    const portfoliodataupdate = await Portfolio.updateOne({ _id: pid }, { Assests: updateddata, Price: price });
    console.log("assest added successfully");
    return NextResponse.json({ status: 200 }, { error: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300 }, { error: "error in addproduct" });
  }
}
