import Portfolio from "../../../../../models/Portfolio";
import User from "../../../../../models/User";
import Assests from "../../../../../models/Assests";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  try {
    const body = await req.json();
    console.log(body)
    const {
      pid,
      useremail,
      PortfolioTotalPrice,
      BuyAmount,
      Transactionid,
      Transactionamount,
      OrginalBuyPrice
    } = body;
    await connectDB();
    let total = 0;
    const userData = await User.findOne({ email: useremail });
    if (userData == null) {
      return NextResponse.json({ status: 300, error: "Account Not Found" });

    }
    // console.log(userData);
    const portfoliodata = await Portfolio.findOne({ _id: pid });
    if (portfoliodata == null) {
      return NextResponse.json({ status: 300, error: "Portfolio Not Found" });

    }
    console.log(portfoliodata)
    const per = (parseFloat(BuyAmount) / parseFloat(PortfolioTotalPrice)) * 100;
    const data = {
      AssestId: pid,
      UserId: userData._id,
      AssestTitle: portfoliodata.PortfolioName,
      AssestTotalPrice: PortfolioTotalPrice,
      AssestBuyPrice: BuyAmount,
      PercentageOwn: per,
      Transactionid: Transactionid,
      Transactionamount: Transactionamount,
      Profit: [],
      OrginalBuyPrice

    };
    console.log(body)
    await Assests.create(data);
    const update1 = await Portfolio.updateOne({ _id: pid }, { RemainingPrice: (parseFloat(portfoliodata.RemainingPrice) - parseFloat(BuyAmount)), PercentageRemaining: (parseFloat(portfoliodata.PercentageRemaining) - parseFloat(per)),BuyCount:portfoliodata.BuyCount+1 });
    console.log("assest added successfully");
    return NextResponse.json({ status: 200, error: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 300, error: "error in addproduct" });
  }
}