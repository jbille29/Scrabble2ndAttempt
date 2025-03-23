import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./ScoreBreakdownModal.css";

const ScoreBreakdownModal = ({ scoreBreakdown, lettersLeft, onClose }) => {
  const [displayedWords, setDisplayedWords] = useState([]);
  const [animatedTotalScore, setAnimatedTotalScore] = useState(0);
  const [shareText, setShareText] = useState("");
  const date = new Date().toDateString();

  useEffect(() => {
    let accumulatedScore = 0;
    let delay = 1000;

    scoreBreakdown.forEach((wordEntry, wordIndex) => {
      setTimeout(() => {
        setDisplayedWords((prev) => [
          ...prev,
          { ...wordEntry, score: 0, displayedFeatures: [] },
        ]);

        let tempScore = 0;
        let featureDelay = 800;
        let currentIndex = wordIndex;

        // Step 1: Animate base score
        setTimeout(() => {
          tempScore = wordEntry.baseScore;
          setDisplayedWords((prev) => {
            const updatedWords = [...prev];
            updatedWords[currentIndex] = {
              ...updatedWords[currentIndex],
              score: tempScore,
            };
            return updatedWords;
          });

          setAnimatedTotalScore((prev) => prev + tempScore);

          let nextDelay = 500;

          // Step 2: Apply Letter Multipliers (DL, TL)
          wordEntry.features
            .filter((f) => f.name.includes("Letter"))
            .forEach((feature, featureIndex) => {
              setTimeout(() => {
                tempScore += feature.value;
                accumulatedScore += feature.value;

                setDisplayedWords((prev) => {
                  const updatedWords = [...prev];
                  updatedWords[currentIndex] = {
                    ...updatedWords[currentIndex],
                    score: tempScore,
                    displayedFeatures: [...updatedWords[currentIndex].displayedFeatures, feature],
                  };
                  return updatedWords;
                });

                setAnimatedTotalScore((prev) => prev + feature.value);
              }, nextDelay * (featureIndex + 1));
            });

          // Step 3: Apply Word Multipliers (DW, TW)
          setTimeout(() => {
            let wordMultiplier = 1;
            let wordMultiplierFeatures = wordEntry.features.filter((f) => f.name.includes("Word"));

            wordMultiplierFeatures.forEach((feature) => {
              wordMultiplier *= feature.name.includes("Double") ? 2 : 3;
            });

            if (wordMultiplier > 1) {
              const newScore = tempScore * wordMultiplier;
              accumulatedScore += newScore - tempScore;

              setDisplayedWords((prev) => {
                const updatedWords = [...prev];
                updatedWords[currentIndex] = {
                  ...updatedWords[currentIndex],
                  score: newScore,
                  displayedFeatures: [...updatedWords[currentIndex].displayedFeatures, ...wordMultiplierFeatures],
                };
                return updatedWords;
              });

              setAnimatedTotalScore((prev) => prev + (newScore - tempScore));
            }
          }, featureDelay);
        }, 800);
      }, delay * wordIndex);
    });
  }, [scoreBreakdown]);

  // Generate shareable results
  useEffect(() => {
    const resultText = `🔗 Tethr Game Results 🔗\n📅 Date: ${date}\n🎯 Final Score: ${animatedTotalScore}\n🔡 Remaining Letters: ${lettersLeft}`;

    setShareText(resultText);
  }, [animatedTotalScore, lettersLeft, date]);

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      alert("✅ Results copied to clipboard! Share with your friends!");
    });
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="modal-container"
      >
        <h2 className="modal-title">Final Score</h2>

        {/* Score Breakdown Grid */}
        <div className="modal-grid modal-header">
          <span>Word</span>
          <span>Score</span>
          <span>Features</span>
        </div>

        {/* Words Animation */}
        <div className="modal-grid-body">
          {displayedWords.map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="modal-grid modal-row"
            >
              {/* Word */}
              <motion.span
                className="word-text"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {word.word}
              </motion.span>

              {/* Score Count-up Effect */}
              <motion.span
                className="score-text"
                key={word.score}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {word.score}
              </motion.span>

              {/* Feature Effects */}
              <div className="feature-container">
                {word.displayedFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="feature-tag"
                  >
                    {feature.name} (+{feature.value})
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Score Counter Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="total-score"
        >
          Total Score: {animatedTotalScore}
        </motion.div>

        {/* Shareable Results Section */}
        <div className="share-section">
          <h3>Share Your Results!</h3>
          <textarea className="share-text" readOnly value={shareText}></textarea>
          <button className="copy-button" onClick={copyToClipboard}>
            Copy Results
          </button>
        </div>

        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default ScoreBreakdownModal;
