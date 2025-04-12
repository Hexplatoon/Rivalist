import React from 'react'
import BlobBackground from "../BlobBackground";
import  { useRef } from "react";
import BouncyArrowButton from '../BouncyArrowButton';
import BattleCards from '../BattleCards';

function LandingPage() {
    const contentRef = useRef();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return <>
    <section className="h-screen relative flex flex-col items-center justify-center mb-0">
        <BlobBackground/>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-8xl font-bold -mt-14 mb-10 bg-gradient-to-r from-sky-400 via-purple-500 to-pink-400 inline-block text-transparent bg-clip-text">Rivalist</h1>
          <p className="text-2xl mb-10">Skill Meets Showdown</p>
          {/* <button
            onClick={scrollToContent}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Get Started
          </button> */}
          <BouncyArrowButton/>
        </div>
      </section>

      <BattleCards/>
      </>
}

export default LandingPage