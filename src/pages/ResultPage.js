import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import config from './../data/config';

const ResultPage = ({ resultData }) => {
    const [resultTable, setResultTable] = useState([]);

    useEffect(() => {
        setResultTable(resultData);
    }, [resultData]);

    return (
        <div className="background-grid result-page center-content">
            <div className="center-content">
                <h1>{config.result.title }</h1>
                <h3>{config.result.subTitle}</h3>
                <ul>
                    {resultTable && resultTable.map((category) => (
                        <li key={category.categoryName}>
                            <strong>{category.categoryName}</strong>
                            <ul>
                                {category.jobs.map((job) => (
                                    <li key={job}>{job}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                <div className="ui-card ui-button-container">
                    <Link to="/tri-cartes/" className="button button-normal">
                        Retourner à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
