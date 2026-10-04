import {NextResponse} from "next/server";
import Assests from "@/models/Assests";

export async function GET(request){
    try {


        const data = await Assests.find();
        // console.log("data"+data)
        return NextResponse.json(data);
    }
    catch (e) {
        return NextResponse.json(e);
    }
}
