import { prisma } from "@/app/lib/db";
import NextAuth from "next-auth";
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
     await prisma.user.upsert({
      where: { email: params.user.email },
      update: {},
      create: {
        email: params.user.email,
        provider: "Google",
        role: "Streamer",
      },
    });

    return true;
  }
}
})

export{handler as GET , handler as POST}