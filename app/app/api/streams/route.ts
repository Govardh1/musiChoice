
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prisma } from "@/app/lib/db";
import youtubesearchapi from "youtube-search-api"
var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;


const createStreamSchema = z.object({
  creatorId: z.string().min(1, "creatorId is required"),
  url: z.string().url("Invalid URL"),
});


export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());

    const match = data.url.match(YT_REGEX);
    if (!match?.[1]) {
      return NextResponse.json(
        { message: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const extractedId = match[1];
    const res = await youtubesearchapi.GetVideoDetails(extractedId)
    const title = res.title;
    const thumbnails = res.thumbnail.thumbnails;
    const bestThumbnail = thumbnails[thumbnails.length - 1].url;
    const secondBsetthumbnail = thumbnails[thumbnails.length - 2].url;
    if (extractedId.length !== 11) {
      return NextResponse.json(
        { message: "Invalid YouTube video ID" },
        { status: 400 }
      );
    }
    const stream = await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        bigImg:(thumbnails>1 ? bestThumbnail: "https://www.bing.com/images/search?view=detailV2&ccid=nIcfLYES&id=194115C59F31C256F0F38B3D93BA2D9BA405FC5A&thid=OIP.nIcfLYESEiAWbolDoo2GXQHaEK&mediaurl=https%3a%2f%2flogos-world.net%2fwp-content%2fuploads%2f2020%2f04%2fYouTube-Logo-2015-2017.png&exph=2160&expw=3840&q=youtube&FORM=IRPRST&ck=DCC83F5923A1D63536D84A62161BFA67&selectedIndex=1&itb=1"),
        smallImg:secondBsetthumbnail,
        title:title
      },
    });

    return NextResponse.json({
      message: "added stream",
      id: stream.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error while adding stream" },
      { status: 400 }
    );
  }
}




export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId")
  const streams = await prisma.stream.findMany({
    where: {
      userId: creatorId ?? ""

    }
  })
  return NextResponse.json({ streams })
}	