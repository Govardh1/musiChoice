"use client"
import { AppBar } from "./components/AppBar";

console.log(process.env.GOOGLE_CLIENT_ID)
console.log(process.env.GOOGLE_CLIENT_SECRET)
export default function Home() {
  return (
  
      <main >
       <AppBar/>
      </main>

  );
}
