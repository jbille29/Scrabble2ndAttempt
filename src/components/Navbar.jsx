import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const toggleInfoModal = () => setShowInfoModal(!showInfoModal);
  const toggleStatsModal = () => setShowStatsModal(!showStatsModal);

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
        fontSize: '18px'
      }}>
        <div>Scrabble Game</div>
        <div>
          <button onClick={toggleStatsModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px' }}>
            <FontAwesomeIcon icon={faChartBar} />
          </button>
          <button onClick={toggleInfoModal} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px', marginLeft: '20px' }}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
        </div>
      </nav>
      {showStatsModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          zIndex: 1000,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <h2>Statistics</h2>
          <p>Here you could display game stats such as score, number of games played, etc.</p>
          <button onClick={toggleStatsModal} style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
        </div>
      )}
      {showInfoModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          zIndex: 1000,
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          <h2>Game Instructions</h2>
          <p>Details about how to play the game, rules, tips, and other information.</p>
          <button onClick={toggleInfoModal} style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
