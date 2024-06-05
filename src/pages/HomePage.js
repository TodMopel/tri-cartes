import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import './../App.css';

import ArrowIconL from './../images/ArrowL.png';
import ArrowIconR from './../images/ArrowR.png';

import config from './../data/config';

const HomePage = ({ onGoogleSheetSubmit, onStartGameSubmit }) => {
    const [googleSheetURL, setGoogleSheetURL] = useState(config.home.baseURL);
    const [candidatName, setCandidatName] = useState(config.home.baseCandidatName);
    const [extractionCount, setExtractionCount] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [localStorageDetected, setLocalStorageDetected] = useState(false);

    const [tooltipOpen, setTooltipOpen] = useState(true);


    useEffect(() => {
        const isLocalStorageDetected = localStorage.getItem('gameState');
        setLocalStorageDetected(!!isLocalStorageDetected);

        fetchGoogleSheetData();
    }, []);

    const handleURLChange = (event) => {
        setGoogleSheetURL(event.target.value);
    };
    const handleCandidatNameChange = (event) =>{
        setCandidatName(event.target.value);
    }

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

        onStartGameSubmit(candidatName);
    };

    const handleResumeSubmit = () => {
        onStartGameSubmit();
    };

    const handleToolTip = () => {
        setTooltipOpen(prevPosition => !prevPosition);
        const tooltipContainer = document.getElementById('ToolTip');
        if (tooltipContainer) {
            const boundingRect = tooltipContainer.getBoundingClientRect();
            const dynamicPosition = boundingRect.width;
            
            tooltipContainer.style.transform = tooltipOpen 
                ? 'translate(0%, 0%)' 
                : `translate(${dynamicPosition}px, 0%)`;
        }
    }

    return (
        <div className="background-grid home-page center-content">
            <div className="center-content">
                <h1>{config.home.title}</h1>
                <h3>{config.home.subTitle}</h3>
                <input
                        className="input-field"
                        type="text"
                        value={candidatName}
                        onChange={handleCandidatNameChange}
                        placeholder="Sophie"
                        style={{ width: `30%` }}

                    />
                <div className="ui-card ui-button-container">
                    <Link
                        onClick={handleStartSubmit}
                        to="/game"
                        className="button button-normal"
                    >
                        {config.home.buttonStart}
                    </Link>
                </div>

                {localStorageDetected && (
                    <Link
                        onClick={handleResumeSubmit}
                        to="/game"
                        className="button button-small"
                    >
                        {config.home.buttonResume}
                    </Link>
                )}
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


            <div
            className="ui-button-container ui-tooltip-container"
            id="ToolTip"
            style={{ transform: 'translate(308px, 0%)' }}
            >
                <div
                    className="ui-tooltip-arrow"
                    onClick={handleToolTip}
                > 
                    <img src={tooltipOpen ? ArrowIconL : ArrowIconR} alt="Arrow" />
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
            </div>


            <div
                className="cartes-counter"
                >
                    Version 0.24
            </div>
        </div>
    );
};

export default HomePage;
