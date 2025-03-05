// GameModals.jsx - Handles game modals
const GameModals = ({ showModal, modalContent, handleCloseModal, showTutorial, handleTutorialClose }) => {
    return (
        <>
            {showTutorial && (
                <div>
                    <h2>Welcome to Your First Game!</h2>
                    <p>This is a quick tutorial to get you started.</p>
                    <button onClick={handleTutorialClose}>Close Tutorial</button>
                </div>
            )}
            {showModal && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, borderRadius: '8px', boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}>
                    <p>{modalContent}</p>
                    <button onClick={handleCloseModal} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 16px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                </div>
            )}
        </>
    );
};

export default GameModals;