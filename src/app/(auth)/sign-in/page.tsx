'use client'
import { useSession, signIn, signOut } from "next-auth/react";
export default function Component(){
  const { data: session } = useSession();
  if(session){
    return (
      <>
      <div>Welcome {session.user.name}</div>;
      <button onClick = {() => signOut()}>Sign Out</button>
      </>
    )
  }
  return (
    <>
    Not Signed in
    </>
  )
}