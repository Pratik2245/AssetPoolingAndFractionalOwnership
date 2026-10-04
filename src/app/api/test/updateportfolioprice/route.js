// import User from "../../../models/User";
import Portfolio from "../../../../models/Portfolio";
import Assests from "../../../../models/Assests";
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        // console.log("allportflop")
        const body = await req.json();
        const { updatedprice } = body; await connectDB();
        const portfoliodata = await Portfolio.find();
        for (let i = 0; i < portfoliodata.length; i++) {
            if (portfoliodata[i].PortfolioPrice[portfoliodata[i].PortfolioPrice.length - 1].Price != updatedprice) {
                let diff = updatedprice - parseFloat(portfoliodata[i].Price);
                portfoliodata[i].PortfolioPrice.push({ Price: updatedprice, date: new Date().toUTCString() });
                const updatePotfolio = await Portfolio.updateOne({ _id: portfoliodata[i]._id }, { Price: updatedprice, PortfolioPrice: portfoliodata[i].PortfolioPrice });
                const Assestdata = await Assests.find({ AssestId: portfoliodata[i]._id });
                if (Assestdata != []) {
                    for (let j = 0; j < Assestdata.length; j++) {
                        let gainamount = ((diff / 100) * parseFloat(Assestdata[j].PercentageOwn));
                        let buyamount = parseFloat(Assestdata[j].AssestBuyPrice) + gainamount;
                        let remainingamount = ((parseFloat(portfoliodata[i].RemainingPrice) + diff) - gainamount);
                        console.log(diff, gainamount, buyamount)

                        const updatePotfolio = await Portfolio.updateOne({ _id: portfoliodata[i]._id }, { RemainingPrice: remainingamount });

                        let profit = parseFloat(portfoliodata[i].Price) - parseFloat(Assestdata[j].OrginalBuyPrice);
                        console.log(parseFloat(portfoliodata[i].Price), profit, parseFloat(Assestdata[j].OrginalBuyPrice))
                        const updateAssest = await Assests.updateOne({ _id: Assestdata[j]._id }, { Profit: profit, AssestBuyPrice: buyamount, AssestTotalPrice: portfoliodata[i].Price });

                    }
                }
            }
            else {
                console.log("no update")
            }

        }
        // console.log(portfoliodata);
        return NextResponse.json({ status: 200, error: portfoliodata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}