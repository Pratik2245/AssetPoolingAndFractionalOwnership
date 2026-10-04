// import User from "../../../../models/User";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import connectDB from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        // console.log("allportflop")
        await connectDB();
        const portfoliodata = await Portfolio.find();
        const userData = await User.find({ role: "user" });
        const orgData = await User.find({ role: "admin" });
        // console.log(portfoliodata);
        return NextResponse.json({ status: 200, portfolio: portfoliodata.length, userData: userData.length, orgData: orgData.length });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: "check internet connection" });
    }
}
