'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth';


export default function Navbar() {

    const {data: session} = useSession();

    const user: User = session?.user;

  return (
    <nav>
        <div>
            <a href="#">Mystry Message</a>
            {
                session? (
                    <>
                    <span>Welcome, {user.username || user.email}</span>
                    <button className='w-full md:w-auto' onClick={() => signOut()}>Log out</button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <button className='w-full md:w-auto'>Login</button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
