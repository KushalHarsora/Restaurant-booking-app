'use client';

import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";

const Home = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get(`${process.env.NEXT_PUBLIC_domain!}/`);
        const { message } = response.data;
        alert(message);
      } catch (error) {
        alert(`error: ${error}`);
      }
    }

    fetchData()
  }, [])

  return (
    <main className=" h-screen w-screen flex justify-center items-center">
      Hello World
    </main>
  );
}

export default Home
