import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';

function App() {
    const [jobListData, setJobListData] = useState(null);
    const [resultData, setResultData] = useState(null);

    const handleGoogleSheetSubmit = (data) => {
        setJobListData(data);
    };

    const handleEndGameSubmit = (data) => {
        setResultData(data);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/tri-cartes/"
                    element={<HomePage onGoogleSheetSubmit={handleGoogleSheetSubmit} />}
                />
                <Route
                    path="/tri-cartes/game"
                    element={<GamePage jobListData={jobListData} onResultSubmit={handleEndGameSubmit} />}
                />
                <Route
                    path="/tri-cartes/result"
                    element={<ResultPage resultData={resultData} />}
                />
            </Routes>
        </Router>
    );
}

export default App;