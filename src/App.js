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
                    path="/game"
                    element={<GamePage jobListData={jobListData} />}
                />
                <Route
                    path="/"
                    element={<HomePage onGoogleSheetSubmit={handleGoogleSheetSubmit} />}
                />
            </Routes>
        </Router>
    );
}

export default App;