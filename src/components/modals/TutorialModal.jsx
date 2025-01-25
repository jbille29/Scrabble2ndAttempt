import React from 'react';

const TutorialModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', zIndex: 1000,
      borderRadius: '8px', boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <p>Welcome to the new game of the day!</p>
      <button onClick={onClose} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Start Playing
      </button>
    </div>
  );
};

export default TutorialModal;
