import User from "../../../models/User";
import connectDB from "../../../utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { useremail, walletaddress } = body;
    await connectDB();
    console.log(body);
    await User.updateOne({ email:useremail }, { metamaskaddress: walletaddress });
    console.log("account created");
    return NextResponse.json({ status: 200 }, { error: "success" });
  } catch (error) {
    console.log("account not create");
    console.log(error.message);
    return NextResponse.json({ status: 300 }, { error: "error in addproduct" });
  }
}
