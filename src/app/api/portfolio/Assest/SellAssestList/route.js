import User from "../../../../../models/User";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";
import SellAssest from "@/models/SellAssest";

export async function POST(req, res) {
    try {
        const body = await req.json();
        // console.log(body);
        const { email } = body;
        await connectDB();
        const userdetails = await User.findOne({ email: email });
        // console.log(userdetails)
        const Assestdata = await SellAssest.find({ UserId: userdetails._id });
        // console.log(Assestdata);
        return NextResponse.json({ status: 200, error: Assestdata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: error.message });
    }
}
