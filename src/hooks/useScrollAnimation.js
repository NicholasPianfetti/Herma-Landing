import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - { ref, isVisible, hasAnimated }
 */
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsVisible(true);
        setHasAnimated(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return { ref, isVisible, hasAnimated };
};

/**
 * Custom hook for staggered animations within a container
 * @param {number} itemCount - Number of items to animate
 * @param {number} staggerDelay - Delay between each item (in ms)
 * @returns {Object} - { containerRef, itemsVisible }
 */
export const useStaggeredAnimation = (itemCount, staggerDelay = 200) => {
  const [containerVisible, setContainerVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !containerVisible) {
        setContainerVisible(true);

        // Stagger the appearance of items
        for (let i = 0; i < itemCount; i++) {
          setTimeout(() => {
            setItemsVisible(prev => [...prev, i]);
          }, i * staggerDelay);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [itemCount, staggerDelay, containerVisible]);

  return { containerRef, itemsVisible, containerVisible };
};