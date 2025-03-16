import React from 'react';
import { FaChartSimple, FaCircleQuestion } from "react-icons/fa6";
import './Navbar.css'; // Import the CSS file
import logo from '../assets/Scrado.png'; // Import the logo

const Navbar = ({ onToggleStats, onToggleInfo }) => {
  return (
    <nav className="navbar">
      <img src={logo} alt="" />
      <div>
        <button onClick={onToggleStats}>
          <FaChartSimple/>
        </button>
        {/*}
        <button onClick={onToggleInfo}>
          <FaCircleQuestion />
        </button>
        */}
      </div>
    </nav>
  );
};

export default Navbar;
