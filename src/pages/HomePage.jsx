import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

import tethr_thumb from '../assets/thumbs/tethr_thumb.png';

const games = [
    { name: "Tethr", image: tethr_thumb, path: "/tethr" },
    { name: "Future Game 1", image: "/images/future1.png", path: "/future1" },
    { name: "Future Game 2", image: "/images/future2.png", path: "/future2" }
];

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="homepage-nav">
        <img src="/images/logo.png" alt="PuzzlersBay Logo" className="logo"/>
        <button className="login-button">Log in</button>
      </nav>
      
      {/* Game Tiles Grid */}
      <div className="games-grid">
        {games.map((game, index) => (
          <Link to={game.path} key={index} className="game-tile">
            <img src={game.image} alt={game.name} className="game-image" />
            <h2>{game.name}</h2>
          </Link>
        ))}
      </div>
      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 PuzzlersBay. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default HomePage;
