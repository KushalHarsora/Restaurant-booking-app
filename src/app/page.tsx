'use client';

import Home from "@/components/custom/Home";
import Navbar from "@/components/custom/Navbar";

const Main = () => {

  return (
    <main className=" absolute top-0 left-0 h-screen w-screen flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
      <Navbar />
      <Home />
    </main>
  );
}

export default Main
