
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import { prisma } from "@/app/lib/db";
const YOUTUBE_REGEX =
/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;



const createStreamSchema=z.object({
	creatorId:z.string(),
	url:z.string()
})


export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());

    const match = data.url.match(YOUTUBE_REGEX);
	console.log(match)
    if (!match) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const extractedId = match[1];

   const stream= await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
      },
    });
	

    return NextResponse.json({
		message:"added stream",
		id:stream.id
	 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error while adding stream" },
      { status: 400 }
    );
  }
}



export async function GET(req:NextRequest){
	const creatorId=req.nextUrl.searchParams.get("creatorId")
	const streams=await prisma.stream.findMany({
		where:{
			userId:creatorId??""

		}
	})
	return NextResponse.json({streams})
}	