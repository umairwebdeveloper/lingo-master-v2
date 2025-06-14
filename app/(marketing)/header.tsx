
import { Button } from '@/components/ui/button'
import {
    ClerkLoaded,
    ClerkLoading,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    auth,
} from "@clerk/nextjs";
import { Ghost, Loader } from 'lucide-react'
import Image from 'next/image'
import React from 'react'



export const Header = () => {

    return (
        <header className='h-20 w-full border-b-2 border-slate-200 px-4'>
            <div className="lg:max-w-screen-lg mx-auto flex items-center h-full justify-between">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/logos/full_logo.svg" height={200} width={200} alt='mascot' />
                </div>
                <ClerkLoading>
                    <Loader className='h-5  w-5 text-muted-foreground animate-spin' />
                </ClerkLoading>
                <ClerkLoaded>

                    <SignedIn>
                        <UserButton afterSignOutUrl='/' />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal" afterSignInUrl='/learn' afterSignUpUrl='/learn'>
                            <Button size={"lg"} variant={"ghost"}> login</Button>
                        </SignInButton>

                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
}
