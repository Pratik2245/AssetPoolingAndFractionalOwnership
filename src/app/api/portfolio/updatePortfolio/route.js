// import User from "../../../models/User";
import Portfolio from "../../../../models/Portfolio";
import Assests from "../../../../models/Assests";
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        // console.log("allportflop")
        const body = await req.json();
        let total = 0;
        console.log(req.body)
        const { updatedprice, id } = body;
        await connectDB();
        const portfoliodata = await Portfolio.findOne({ _id: id });

        for (let i = 0; i < portfoliodata.Assests.length; i++) {
            portfoliodata.Assests[i].Assest_Price = (updatedprice[i]);
            total += updatedprice[i] * portfoliodata.Assests[i].Assest_Quantity;
            console.log(portfoliodata.Assests[i].Assest_Price);
        }
        console.log(total);
        portfoliodata.PortfolioPrice.push({ Price: total, date: new Date() });
        const updatePotfolio = await Portfolio.updateOne({ _id: portfoliodata._id }, { Price: total, PortfolioPrice: portfoliodata.PortfolioPrice, Assests: portfoliodata.Assests });

        if (portfoliodata.PortfolioPrice.length) {
        }

        // if (portfoliodata.PortfolioPrice[portfoliodata.PortfolioPrice.length - 2].Price != total) {
        let diff = parseFloat(total) - parseFloat(portfoliodata.PortfolioPrice[portfoliodata.PortfolioPrice.length - 2].Price)
        console.log("difference" + diff)
        const Assestdata = await Assests.find({ AssestId: portfoliodata._id });
        // const Assestdata = [
        //     {
        //         "AssestId": "65a0c34d84e37e5bce9c8877",
        //         "UserId": "658e36c11f2803521334da92",
        //         "AssestTitle": "TATA",
        //         "AssestTotalPrice": "400",
        //         "OrginalBuyPrice": "100",
        //         "AssestBuyPrice": "100",
        //         "PercentageOwn": "25",
        //         "Transactionid": "0xc620f5daf2212a721e8fd558aef9640e135e789ecdbbf82b16b6a1922354eda0",
        //         "Transactionamount": "0.00046385846750439505",
        //         "Profit": [],
        //         "createdAt": {
        //             "$date": "2024-01-12T04:44:13.736Z"
        //         },
        //         "updatedAt": {
        //             "$date": "2024-01-12T04:44:13.736Z"
        //         },
        //         "__v": 0
        //     }
        // ]
        if (Assestdata != []) {
            for (let j = 0; j < Assestdata.length; j++) {
                let gainamount = ((diff / 100) * parseFloat(Assestdata[j].PercentageOwn));
                console.log("gainamount" + gainamount);
                let buyamount = parseFloat(Assestdata[j].AssestBuyPrice) + gainamount;
                console.log(portfoliodata.PercentageRemaining)
                let remainingamount = ((diff / 100) * parseFloat(portfoliodata.PercentageRemaining));
                console.log("remaining price" + remainingamount)

                const updatePotfolio = await Portfolio.updateOne({ _id: portfoliodata._id }, { RemainingPrice: parseFloat(portfoliodata.RemainingPrice) + parseFloat(remainingamount) });

                let profit = parseFloat(portfoliodata.Price) - parseFloat(Assestdata[j].OrginalBuyPrice);
                console.log(parseFloat(portfoliodata.Price), profit, parseFloat(Assestdata[j].OrginalBuyPrice))
                const updateAssest = await Assests.updateOne({ _id: Assestdata[j]._id }, { Profit: profit, AssestBuyPrice: buyamount, AssestTotalPrice: portfoliodata.Price });

            }
        }
        // }
        // else {
        //     console.log("no update")
        // }


        // console.log(portfoliodata);
        return NextResponse.json({ status: 200, error: portfoliodata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}