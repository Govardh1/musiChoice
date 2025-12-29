import { prisma } from "@/app/lib/db";
import NextAuth from "next-auth";
import youtubesearchapi from "youtube-search-api"
import GoogleProvider from "next-auth/providers/google";
const handler=NextAuth({
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ?? " ",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? " "
  })
],
callbacks:{
  async signIn(params){
    console.log(params);
    if (!params.user.email){
      return false
    }
     await prisma.user.create({
      data: {
        email: params.user.email,
        provider: "Google",
        role:"EndUser"
      },
    });

    return true;
  }
}
})

export{handler as GET , handler as POST}