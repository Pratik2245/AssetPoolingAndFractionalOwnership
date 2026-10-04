import {NextResponse} from "next/server";
import Assests from "@/models/Assests";

export async function GET(request,{params}){
    try {
        const data = await Assests.findOne({_id:params.AssestId});
        // console.log("data"+data)
        return NextResponse.json(data);
    }
    catch (e) {
        return NextResponse.json("no data found");
    }
}
