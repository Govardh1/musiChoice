import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import { prisma } from "@/app/lib/db";

const UpvoteSchema=z.object({
	streamId:z.string()
})
export async function POST(req:NextRequest) {
	const session=getServerSession()
	const user=await prisma.user.findFirst({
		where:{
			email:session?.user?.email ?? " "
		}
	})
	if (!user) {
		return NextResponse.json({
			msg:"user does not exits"
		},{
			status:403
		})
	}
}