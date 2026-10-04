import Portfolio from "../../../../models/Portfolio";
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
var CryptoJS = require("crypto-js");

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { pid } = body;
        console.log(body);
        await connectDB();
        const portfoliodata = await Portfolio.findOne({ _id: pid });
        const { PortfolioPrice } = portfoliodata;

        const CurrYear = [];
        const oldestDate = PortfolioPrice.reduce((oldest, current) => {
            const currentDateObj = new Date(current.date);
            return oldest < currentDateObj ? oldest : currentDateObj;
        }, new Date());

        const newestDate = PortfolioPrice.reduce((newest, current) => {
            const currentDateObj = new Date(current.date);
            return newest > currentDateObj ? newest : currentDateObj;
        }, new Date());

        console.log("Oldest Date:", oldestDate.toISOString());
        console.log("Newest Date:", newestDate.toISOString());

        let oldDate = new Date(oldestDate);
        let currentDate = new Date();
        console.log(oldDate, newestDate);
        while (oldDate <= newestDate) {
            CurrYear.push({ date: new Date(oldDate), price: 0 });
            oldDate.setDate(oldDate.getDate() + 1);
        }
        CurrYear.push({ date: new Date(oldDate), price: 0 })
        PortfolioPrice.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log(CurrYear);
        let prevPrice;
        let j = 0;
        let newArray = [];

        for (let i = 0; i < CurrYear.length; i++) {
            const currYearDate = new Date(CurrYear[i].date);
            const latestEntry = PortfolioPrice.reduce((latest, item) => {
                const itemDate = new Date(item.date);
                if (
                    itemDate.getFullYear() === currYearDate.getFullYear() &&
                    itemDate.getMonth() === currYearDate.getMonth() &&
                    itemDate.getDate() === currYearDate.getDate() &&
                    (!latest || itemDate > new Date(latest.date))
                ) {
                    return { date: item.date, price: item.Price };
                }
                return latest;
            }, null);

            if (latestEntry) {
                prevPrice = latestEntry.price;
                newArray.push({ date: CurrYear[i].date, price: latestEntry.price });
                j++;
                // console.log(latestEntry.price, j);
            } else {
                newArray.push({ date: CurrYear[i].date, price: prevPrice });
            }
        }
        console.log(newArray)
        return NextResponse.json({ status: 200, currentYear: newArray, portfoliodata: portfoliodata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 500, error: "Internal Server Error" });
    }
}
