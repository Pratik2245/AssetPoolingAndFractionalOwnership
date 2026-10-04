import Portfolio from "../../../../../models/Portfolio";
import Assests from "../../../../../models/Assests";
import SellAssest from "../../../../../models/SellAssest";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const body = await req.json();
        // console.log(body);
        const { id, price, hash } = body;
        // console.log(price)
        await connectDB();
        const AssestData = await Assests.findOne({ _id: id });
        if (!AssestData) {
            return NextResponse.json({ status: 404, error: "Assest Not Found" });

        }
        const deleteAssestdata = await Assests.deleteOne({ _id: id });
        const data = await SellAssest.create({
            AssestId: AssestData.AssestId,
            UserId: AssestData.UserId,
            AssestTitle: AssestData.AssestTitle,
            AssestTotalPrice: AssestData.AssestTotalPrice,
            OrginalBuyPrice: AssestData.OrginalBuyPrice,
            SellPrice: price,
            AssestBuyPrice: AssestData.AssestBuyPrice,
            PercentageOwn: AssestData.PercentageOwn,
            Transactionid: hash,
            Transactionamount: AssestData.Transactionamount,
        })
        const portfoliodata = await Portfolio.findOne({ _id: AssestData.AssestId });
        if (!portfoliodata) {
            return NextResponse.json({ status: 404, error: "Invalid Assest " });

        }
        console.log(portfoliodata)
        let total = parseFloat(portfoliodata.RemainingPrice) + parseFloat(price);
        const portfolioupdate = await Portfolio.findOneAndUpdate(
            { _id: AssestData.AssestId },
            { RemainingPrice: total, PercentageRemaining: parseFloat(portfoliodata.PercentageRemaining) + parseFloat(AssestData.PercentageOwn) },
            { new: true }
        );
        console.log(portfolioupdate)
        return NextResponse.json({ status: 200, error: "Assest Sell Successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: error.message });
    }
}
