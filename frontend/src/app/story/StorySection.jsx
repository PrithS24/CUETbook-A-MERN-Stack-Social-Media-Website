import React, { useEffect, useRef, useState } from "react";
import StoryCard from "./StoryCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";
import { Button } from "@/components/ui/button";


const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef();
  const {story,fetchStoryPost} = usePostStore()


  useEffect(() => {
    fetchStoryPost()
  },[fetchStoryPost])

  // const storyPosts = [
  //   {
  //     _id: 1,
  //     mediaUrl: "https://www.google.com/",
  //     mediaType: "video",
  //     user: {
  //       username: "Tazin",
  //     },
  //   },
  // ];

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [story]);
  
  // [storyPosts]);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex space-x-2 overflow-x-hidden py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <motion.div
          className=" flex space-x-2"
          drag="x"
          dragConstraint={{
            right: 0,
            left:
              // -((storyPosts.length + 1) * 200) +
              -((story.length + 1) * 200) +
              containerRef.current?.offsetWidth,
          }}
        >
          <StoryCard isAddStory={true} />
          {/* {storyPosts?.map((story) => ( */}
          {story?.map((story) => (
            <StoryCard story={story} key={story._id} />
          ))}
        </motion.div>
        {/* left side scroll button */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* right side scroll button */}

        {scrollPosition < maxScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default StorySection;