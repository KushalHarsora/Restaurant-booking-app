'use client';

import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const Home = () => {

  const router = useRouter();

  return (
    <section className="absolute top-[7vh] left-0 h-[93vh] w-screen overflow-hidden flex flex-row max-md:flex-col justify-center items-center">
        <div className="h-full max-md:h-3/5 w-3/5 max-md:w-full flex flex-col justify-center items-center p-8">
            <h1 className="text-4xl font-bold text-center mb-4 bg-orange-300 px-2 py-1 max-md:text-2xl">Why Book With Us?</h1>
            <p className="text-lg text-center mb-6">
                We offer the best experiences with exceptional customer service, great discounts, and easy booking process. 
                Don&apos;t miss out on the opportunity to book with us today!
            </p>
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
              onClick={() => router.push("/book")}
            >
                Book Now
            </button>
        </div>
        <div className="h-full max-md:h-2/5 w-2/5 max-md:w-full flex justify-center items-end pb-[7.5vh] max-md:pb-0">
          <Image
            src={'/momo.svg'}
            alt={'Momo Image'}
            height={300}
            width={500}
            loading='eager'
            className=" animate-bounce max-md:w-3/5"
          />
        </div>
    </section>
  )
}

export default Home
