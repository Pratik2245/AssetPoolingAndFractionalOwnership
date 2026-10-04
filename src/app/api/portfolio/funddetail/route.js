import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";
import orgTransfer from "@/models/orgTransfer";

export async function POST(req, res) {

    try {
        const body = await req.json();
        const { pid } = body;
        console.log(pid)
        await connectDB();
        const FundData = await orgTransfer.findOne({ PortfolioId: pid });
        if (FundData == null) {
            return NextResponse.json({ status: 404, error: "Not Found" });
        }
        else {
            return NextResponse.json({ status: 200, error: FundData });
        }

    }
    catch (error) {
        return NextResponse.json({ status: 400, error: "unsuccessfull" });

    }
}