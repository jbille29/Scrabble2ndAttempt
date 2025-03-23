import React from 'react';
import { FaChartSimple, FaCircleQuestion } from "react-icons/fa6";
import './Navbar.css'; // Import the CSS file
import logo from '../games/tethr/assets/tethr.png'; // Import the logo

const Navbar = ({ onToggleStats, onToggleInfo }) => {
  return (
    <nav className="navbar">
      
      <img 
        src={logo} 
        alt="" 
        style={{
          height: '50px'
        }}
        />
      <div>
        {/*}
        <button onClick={onToggleStats}>
          <FaChartSimple/>
        </button>
        
        <button onClick={onToggleInfo}>
          <FaCircleQuestion />
        </button>
        */}
      </div>
    </nav>
  );
};

export default Navbar;
