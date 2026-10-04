import Portfolio from "../../../../models/Portfolio";
import Assests from "../../../../models/Assests";
import SellAssest from "../../../../models/SellAssest";
import connectDB from "../../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { pid } = body;
        // console.log(pid)
        await connectDB();
        const AssestData = await Assests.find({ AssestId: pid });
        if (AssestData) {
            return NextResponse.json({ status: 200, error: AssestData });

        }
        else {
            return NextResponse.json({ status: 404, error: "No Data Found" });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ status: 300, error: error.message });
    }
}