
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import { prisma } from "@/app/lib/db";
const YOUTUBE_REGEX=new RegExp("^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$")

const createStreamSchema=z.object({
	creatorId:z.string(),
	url:z.string()
})


export async function POST(req:NextRequest){
try {
	const data=createStreamSchema.parse(await req.json())
	const isYt=YOUTUBE_REGEX.test(data.url)
	if (!isYt) {
	return NextResponse.json({
		message:"Error while adding strream"
	},{
		status:401
	})	
	}
	const extractedId=data.url.split("?v=")[1]
	await prisma.stream.create({
		data:{
			userId:data.creatorId,
			url:data.url,
			extractedId,
			type:"Youtube"
		}
	})
} catch (error) {
	return NextResponse.json({
		message:"Error while adding strream"
	},{
		status:401
	})
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