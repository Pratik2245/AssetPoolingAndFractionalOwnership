import User from "@/models/User";
// import Portfolio from "../../../../models/Portfolio";
import connectDB from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    connectDB();
    const body = await req.json();
    try {

        const { Email } = body;
        // console.log(Email);
        const userData = await User.findOne({ email: Email });
        return NextResponse.json({ status: 200, error: userData });
    }
    catch (error) {
        return NextResponse.json({ status: 404, error: "User Account Not Found" });

    }


}