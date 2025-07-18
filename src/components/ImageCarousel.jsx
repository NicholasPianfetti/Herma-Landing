import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 0;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

const ImageCarousel = ({ slides, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef(null);

  const loop = true;
  const carouselItems = loop ? [...slides, slides[0]] : slides;
  const itemWidth = 100;
  const trackItemOffset = itemWidth + GAP;

  // Mouse hover handlers
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  // Autoplay logic
  useEffect(() => {
    if (!isHovered && !isResetting && !isDragging) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === slides.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered, isResetting, isDragging, loop, slides.length, carouselItems.length]);

  // Handle animation complete for loop reset
  const handleAnimationComplete = useCallback(() => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  }, [loop, currentIndex, carouselItems.length, x]);

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((_, info) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(slides.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  }, [loop, currentIndex, slides.length, carouselItems.length]);

  // Handle navigation dot click
  const handleDotClick = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing" 
      style={{ paddingBottom: "56.25%" }}
    >
      <motion.div
        className="absolute inset-0 flex"
        drag="x"
        {...dragProps}
        style={{
          width: `${carouselItems.length * 100}%`,
          x,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) + "%" }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        {carouselItems.map((slide, index) => (
          <motion.div
            key={index}
            className="relative flex-shrink-0"
            style={{
              width: `${100 / carouselItems.length}%`,
              height: "100%"
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="w-full h-full object-cover cursor-pointer select-none"
              onClick={() => onImageClick(slide)}
              draggable={false}
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 p-2 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentIndex % slides.length === index 
                ? "bg-[var(--highlight-color)] w-8" 
                : "bg-blue-300 hover:bg-blue-400 w-2.5"
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: currentIndex % slides.length === index ? 1.2 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-200/30">
        <motion.div
          className="h-full bg-[var(--highlight-color)]"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentIndex % slides.length + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ImageCarousel; 