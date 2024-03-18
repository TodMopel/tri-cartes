import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import './../App.css';

import config from './../data/config';

const HomePage = ({ onGoogleSheetSubmit, onStartGameSubmit }) => {
    const [googleSheetURL, setGoogleSheetURL] = useState(config.home.baseURL);
    const [extractionCount, setExtractionCount] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [localStorageDetected, setLocalStorageDetected] = useState(false);

    useEffect(() => {
        const isLocalStorageDetected = localStorage.getItem('gameState');
        setLocalStorageDetected(!!isLocalStorageDetected);

        fetchGoogleSheetData();
    }, []);

    const handleURLChange = (event) => {
        setGoogleSheetURL(event.target.value);
    };

    useEffect(() => {
        fetchGoogleSheetData();
    }, []);

    const fetchGoogleSheetData = async () => {
        try {
            const response = await axios.get(googleSheetURL);
            const csvData = response.data;

            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                complete: (result) => {
                    const activeJobs = result.data.filter((row) => row.ACTIF === true);

                    const formattedData = activeJobs.map((row) => ({
                        text: row.MÉTIER,
                        description: row.DESCRIPTION,
                    }));

                    setExtractionCount(activeJobs.length);
                    setErrorMessages([]);
                    onGoogleSheetSubmit(formattedData);
                },
                error: (error) => {
                    console.error('Erreur lors de l\'analyse CSV :', error);
                    setExtractionCount(null);
                    setErrorMessages([error.message]);
                },
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données du Google Sheet :', error);
            setExtractionCount(null);
            setErrorMessages([`Erreur lors de la récupération des données du Google Sheet:\n ${error}`]);
        }
    };

    const handleSubmit = () => {
        setExtractionCount(null);
        fetchGoogleSheetData();
    };

    const handleStartSubmit = () => {
        localStorage.removeItem('gameState');
        onStartGameSubmit();
    };

    const handleResumeSubmit = () => {
        onStartGameSubmit();
    };

    return (
        <div className="background-grid home-page center-content">
            <div className="center-content">
                <h1>{config.home.title}</h1>
                <h3>{config.home.subTitle}</h3>
                <div className="ui-card ui-button-container">
                    <Link
                        onClick={handleStartSubmit}
                        to="/game"
                        className="button button-normal"
                    >
                        {config.home.buttonStart}
                    </Link>
                </div>

                {localStorageDetected && ( // Affichage conditionnel du bouton de reprise
                    <Link
                        onClick={handleResumeSubmit}
                        to="/game"
                        className="button button-small"
                    >
                        {config.home.buttonResume}
                    </Link>
                )}
            </div>
            <div className="option-menu ui-card">
                <h2>{`${config.home.titleUpdateList}`}</h2>
                <div>{`(${config.home.subTitleUpdateList})`}</div>
                <div className="row-content">
                    <input
                        className="input-field"
                        type="text"
                        value={googleSheetURL}
                        onChange={handleURLChange}
                        placeholder="Enter Google Sheet URL"
                    />
                    <div onClick={handleSubmit} className="button button-small">
                        {config.home.buttonUpdateList}
                    </div>
                </div>
            </div>
            <div>
            {extractionCount !== null && (
                <div className={`ui-card info-box success`}>
                    {`${extractionCount} ${config.home.infoUpdateList}`}
                </div>
            )}
            {errorMessages.length > 0 && (
                <div className={`ui-card info-box error`}>
                    <ul className="error-list">
                        {errorMessages.map((errorMessage, index) => (
                            <li key={index}>{errorMessage}</li>
                        ))}
                    </ul>
                </div>
            )}
            </div>
        </div>
    );
};

export default HomePage;
