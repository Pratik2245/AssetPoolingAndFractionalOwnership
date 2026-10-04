import User from "@/models/User";
// import Portfolio from "../../../../models/Portfolio";
import connectDB from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    connectDB();
    const body = await req.json();
    try {

        const { name,
            email,
            address,
            waddress,
            phone,
            pincode } = body.user;
        console.log(body);
        const userData = await User.updateOne({ email: email }, { name, address, pincode, phone, metamaskaddress: waddress, pic: body.pic });
        return NextResponse.json({ status: 200, error: " Profile Update Successfully" });
    }
    catch (error) {
        return NextResponse.json({ status: 404, error: "User Account Not Found" });

    }


}