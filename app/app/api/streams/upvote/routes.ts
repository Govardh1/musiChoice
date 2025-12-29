import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import { prisma } from "@/app/lib/db";

const UpvoteSchema=z.object({
	streamId:z.string()
})
export async function POST(req:NextRequest) {
	
	const session= await getServerSession()

	const user=await prisma.user.findFirst({
		where:{
			email:session?.user?.email ?? " "
		}
	})
	if (!user) {
		return NextResponse.json({
			msg:"unauthenticated"
		},{
			status:403
		})
	}
	try {
		const data=UpvoteSchema.parse(await req.json())
		await prisma.upvote.create({
			data:{
				userId:user.id,
				streamId:data.streamId
			}
		})
	} catch (error) {
		return NextResponse.json({
			msg:"error while upvoting"
		},{
			status:403
		})
	}
}