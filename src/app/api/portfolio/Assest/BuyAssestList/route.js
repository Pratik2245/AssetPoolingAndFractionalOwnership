import User from "../../../../../models/User";
import Assests from "../../../../../models/Assests";
import connectDB from "../../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const body = await req.json();
        // console.log(body);
        const { email } = body;
        await connectDB();
        const userdetails = await User.findOne({ email: email });
        // console.log(userdetails)
        const Assestdata = await Assests.find({ UserId: userdetails._id });
        // console.log(Assestdata);
        return NextResponse.json({ status: 200, error: Assestdata });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: error.message });
    }
}
