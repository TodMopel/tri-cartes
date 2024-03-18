import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';

function App() {
    const [jobListData, setJobListData] = useState(null);
    const [resultData, setResultData] = useState(null);

    const [activePage, setActivePage] = useState(window.location.pathname);
    useEffect(() => {
        console.log('Active Page:', activePage);
        if (activePage == "/game")
            navigateToHomePage();
    }, [activePage]);

    const navigateToHomePage = () => {
        // Utilisez le composant Navigate de react-router-dom pour la redirection
        return <Navigate to="/" />;
    };

    const handleGoogleSheetSubmit = (data) => {
        setJobListData(data);
    };

    const handleEndGameSubmit = (data) => {
        setResultData(data);
        setActivePage('/result');
    };

    const handleStartGameSubmit = () => {
        setActivePage('/game');
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage onGoogleSheetSubmit={handleGoogleSheetSubmit} onStartGameSubmit={handleStartGameSubmit} />}
                />
                <Route
                    path="/game"
                    element={<GamePage jobListData={jobListData} onResultSubmit={handleEndGameSubmit} />}
                />
                <Route
                    path="/result"
                    element={<ResultPage resultData={resultData} />}
                />
            </Routes>
        </Router>
    );
}

export default App;