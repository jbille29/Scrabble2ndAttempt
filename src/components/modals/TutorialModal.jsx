import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TutorialModal.css";

// Sample tutorial images (replace with actual paths)
import step1 from "../../assets/tutorial-step1.jpg";
import step2 from "../../assets/tutorial-step2.jpg";
import step3 from "../../assets/tutorial-step3.jpg";

const tutorialSteps = [
  {
    title: "How to Play",
    text: "Find words using the given letters. Longer words score more points!",
    image: step1,
  },
  {
    title: "Scoring",
    text: "Each word has a base score. Bonus multipliers apply for special tiles!",
    image: step2,
  },
  {
    title: "Daily Challenge",
    text: "You have one puzzle per day. Try to get the highest score!",
    image: step3,
  },
];

const TutorialModal = ({ isVisible, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);

  if (!isVisible) return null;

  const nextStep = () => {
    if (stepIndex < tutorialSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onClose(); // Close when finished
    }
  };

  return (
    <div className="tutorial-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="tutorial-container"
      >
        <h2 className="tutorial-title">{tutorialSteps[stepIndex].title}</h2>

        <p className="tutorial-text">{tutorialSteps[stepIndex].text}</p>

        <img
          src={tutorialSteps[stepIndex].image}
          alt={`Step ${stepIndex + 1}`}
          className="tutorial-image"
        />

        <button className="tutorial-button" onClick={nextStep}>
          {stepIndex === tutorialSteps.length - 1 ? "Got It!" : "Next"}
        </button>
      </motion.div>
    </div>
  );
};

export default TutorialModal;
