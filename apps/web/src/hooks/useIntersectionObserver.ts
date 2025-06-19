import { useState, useEffect, useRef } from 'react';

// Custom hook for intersection observation with proper types
export const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);

  // Use a mutable ref object to store the IntersectionObserver instance
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (node) {
      observer.current = new IntersectionObserver(([ent]) => setEntry(ent), options);
      observer.current.observe(node);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node, options]);

  return [setNode, entry] as const;
};