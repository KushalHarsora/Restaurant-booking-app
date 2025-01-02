'use client';

import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { AlignJustify } from 'lucide-react';

const Navbar = () => {

    const router = useRouter();

    return (
        <section
            className=' font-mono h-[7vh] w-screen fixed top-0 left-0 flex flex-row justify-between items-center px-[5vw] max-md:px-[10vw] overflow-hidden z-20 backdrop-blur-sm shadow-lg shadow-orange-200'
            style={{ background: 'rgba(255, 255, 255, 0.75)' }}
        >
            <span
                onClick={() => { router.push("/") }}
                className=' text-xl max-md:text-2xl font-bold bg-orange-500 text-white px-2 py-1 max-md:px-3 cursor-pointer'
            >
                Restny
            </span>
            <span className=' max-md:hidden'>
                <Button className=' text-base' variant={'link'} onClick={() => router.push("/")}>Home</Button>
                <Button className=' text-base' variant={'link'} onClick={() => router.push("/check")}>Check Booking</Button>
            </span>
            <span className=' max-md:hidden'>
                <Button className=' text-base bg-orange-500 hover:bg-orange-600' variant={'default'} onClick={() => router.push("/book")}>Book Table</Button>
            </span>
            <span className=' md:hidden'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} className=" hover:bg-transparent">
                            <AlignJustify />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className=" w-full h-full flex flex-col justify-start items-center overflow-hidden gap-6">
                            <span className=' w-fit flex flex-col justify-between items-center'>
                                <Button className=' text-base' variant={'link'} onClick={() => router.push("/")}>Home</Button>
                                <Button className=' text-base' variant={'link'} onClick={() => router.push("/check")}>Check Booking</Button>
                            </span>
                            <span>
                                <Button className=' text-base bg-orange-500 hover:bg-orange-600' variant={'default'} onClick={() => router.push("/book")}>Book Table</Button>
                            </span>
                        </div>
                    </SheetContent>
                </Sheet>
            </span>
        </section>
    )
}

export default Navbar
