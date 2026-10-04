
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
import orgTransfer from "@/models/orgTransfer";

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { pid, transactionHash, Amount } = body;
        await connectDB();
        const data = { transactionHash, date: new Date(), Amount, Method: "withdraw" }
        const FundData = await orgTransfer.findOne({ PortfolioId: pid });
        console.log(FundData)
        if (FundData == null) {
            await orgTransfer.create({
                PortfolioId: pid,
                Transaction: data,
                TotalAmount: Amount
            })
        }
        else {
            FundData.Transaction.push(data)
            console.log(FundData.Transaction)
            const dataFD = await orgTransfer.updateOne({ PortfolioId: pid }, { Transaction: FundData.Transaction, TotalAmount: (parseFloat(FundData.TotalAmount) + parseFloat(Amount)) })
            console.log(dataFD)
        }
        return NextResponse.json({ status: 200, error: "successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}
