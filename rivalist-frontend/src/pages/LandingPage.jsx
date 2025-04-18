import React, {useRef} from "react";
import BlobBackground from "../components/BlobBackground";
import BouncyArrowButton from "../components/BouncyArrowButton";
import BattleCards from "@/components/BattleCards";

function LandingPage() {
  const contentRef = useRef();

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
      <div className="relative">
        {/* Background spans the entire page */}
        <BlobBackground />

        {/* Content sections are positioned above the background */}
        <div className="relative z-10">
          {/* Landing section */}
          <section className="h-screen flex flex-col items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-8xl -mt-10 mb-1 relative z-20 font-bold bg-gradient-to-r from-sky-400 via-purple-500 to-pink-400 inline-block text-transparent bg-clip-text">
                Rivalist
              </h1>
              <p
                className="text-7xl mb-10 outlined-text text-transparent logo"
                style={{ fontFamily: "Bebas Neue" }}
              >
                Skill Meet Showdown
              </p>
              <div onClick={scrollToContent}>
                <BouncyArrowButton />
              </div>
            </div>
          </section>

          {/* Battle page section */}
          <section ref={contentRef}>
            <BattleCards />
          </section>
        </div>
      </div>
  );
}

export default LandingPage;
