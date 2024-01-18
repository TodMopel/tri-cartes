import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
    const [jobListData, setJobListData] = useState(null);

    const handleGoogleSheetSubmit = (data) => {
        setJobListData(data);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/tri-cartes/game"
                    element={<GamePage jobListData={jobListData} />}
                />
                <Route
                    path="/tri-cartes/"
                    element={<HomePage onGoogleSheetSubmit={handleGoogleSheetSubmit} />}
                />
            </Routes>
        </Router>
    );
}

export default App;