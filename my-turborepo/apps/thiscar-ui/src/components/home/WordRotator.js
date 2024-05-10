"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const WordRotator = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <>
      <span className="position-relative">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: index === currentWordIndex ? 0 : -40,
              opacity: index === currentWordIndex ? 1 : 0,
            }}
            transition={{ duration: 0.25 }}
            className="position-absolute mt-8 alternate-text w-100 d-inline-block"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </>
  );
};

export default WordRotator;
