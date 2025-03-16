import React from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./StatsModal.css";

const StatsModal = ({ isVisible, onClose, gameStats = { history: [] } }) => {
  if (!isVisible) return null;

  // Ensure history exists
  const history = gameStats.history || [];

  // Extracting data for visualization
  const dates = history.map(entry => entry.date);
  const scores = history.map(entry => entry.score);
  const maxScores = history.map(entry => entry.maxScore);

  // Compute overall stats
  const totalGames = history.length;
  const averageScore = totalGames
    ? (scores.reduce((a, b) => a + b, 0) / totalGames).toFixed(1)
    : 0;
  const bestScore = totalGames ? Math.max(...scores, 0) : 0;

  // Chart data
  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Score",
        data: scores,
        backgroundColor: "#535693",
        borderRadius: 4,
      },
      {
        label: "Max Possible Score",
        data: maxScores,
        backgroundColor: "#e79a3f",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="stats-overlay">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="stats-container"
      >
        <h2 className="stats-title">📊 Your Game Stats</h2>

        {/* Summary Stats */}
        <div className="stats-summary">
          <div className="stats-item">
            <span className="stat-value">{totalGames}</span>
            <span className="stat-label">Games Played</span>
          </div>
          <div className="stats-item">
            <span className="stat-value">{averageScore}</span>
            <span className="stat-label">Avg Score</span>
          </div>
          <div className="stats-item">
            <span className="stat-value">{bestScore}</span>
            <span className="stat-label">Best Score</span>
          </div>
        </div>

        {/* Performance Chart */}
        {totalGames > 0 ? (
          <div className="chart-container">
            <Bar data={chartData} />
          </div>
        ) : (
          <p className="no-games-text">No games played yet! Play today’s challenge!</p>
        )}

        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default StatsModal;
