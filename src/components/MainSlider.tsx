import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface Slide {
  id: number;
  content: string;
  contentSmall: string;
  href?: string;
}

interface MainSliderProps {
  slides: Slide[];
}

const MainSlider: React.FC<MainSliderProps> = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return resetTimeout;
  }, [index]);

  return (
    <div className="min-w-[344px] w-full lg:max-w-[480px]">
      <div className="overflow-hidden lg:max-h-[286px] relative mx-auto touch-pan-x">
        <motion.div
          className="flex transition-transform lg:max-h-[274px] duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full lg:h-[274px] flex items-center justify-center text-2xl font-bold"
            >
              {slide.href ? (
                <a href={slide.href} target="_blank" className="w-full">
                  <Image
                    src={slide.content}
                    alt="Slide"
                    width={800}
                    height={500}
                    className="md:block hidden w-full rounded-2xl"
                  />
                  <Image
                    src={slide.contentSmall}
                    alt="Slide"
                    width={400}
                    height={250}
                    className="md:hidden block w-full rounded-2xl"
                  />
                </a>
              ) : (
                <>
                  <Image
                    src={slide.content}
                    alt="Slide"
                    width={800}
                    height={500}
                    className="md:block hidden w-full rounded-2xl"
                  />
                  <Image
                    src={slide.contentSmall}
                    alt="Slide"
                    width={400}
                    height={250}
                    className="md:hidden block w-full rounded-2xl"
                  />
                </>
              )}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex mt-3 justify-center space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] w-6 rounded-full transition-all duration-300 ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MainSlider;
