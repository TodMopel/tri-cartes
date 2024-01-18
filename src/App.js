import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

function App() {
    const [jobListData, setJobListData] = useState(null);

    const handleGoogleSheetSubmit = (data) => {
        setJobListData(data);
    };

    return (
        <Router>
            <Switch>
                <Route
                    path="/game"
                    element={<GamePage jobListData={jobListData} />}
                />
                <Route
                    path="/"
                    element={<HomePage onGoogleSheetSubmit={handleGoogleSheetSubmit} />}
                />
            </Switch>
        </Router>
    );
}

export default App;