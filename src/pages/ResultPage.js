import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import config from './../data/config';

const CategoryNode = ({ categoryName, jobs, onDeleteJob }) => {
    return (
        <li>
            <strong>{categoryName}</strong>
            <ul>
                {jobs.map((job, index) => (
                    <JobNode key={index} job={job} onDelete={() => onDeleteJob(categoryName, job)} />
                ))}
            </ul>
        </li>
    );
};

const JobNode = ({ job, onDelete }) => {
    return (
        <li>
            {job}{' '}
            <span className="button-delete" onClick={onDelete}>
                x
            </span>
        </li>
    );
};

const ResultPage = ({ resultData }) => {
    const [resultTable, setResultTable] = useState([]);

    useEffect(() => {
        setResultTable(resultData);
    }, [resultData]);

    const handleDeleteJob = (categoryName, job) => {
        const updatedResultTable = resultTable.map((category) => {
            if (category.categoryName === categoryName) {
                return {
                    ...category,
                    jobs: category.jobs.filter((j) => j !== job),
                };
            }
            return category;
        });

        setResultTable(updatedResultTable);
    };

    return (
        <div className="background-grid result-page center-content">
            <div className="center-content">
                <h1>{config.result.title}</h1>
                <h3>{config.result.subTitle}</h3>
                <ul>
                    {resultTable &&
                        resultTable.map((category, index) => (
                            <CategoryNode
                                key={index}
                                categoryName={category.categoryName}
                                jobs={category.jobs}
                                onDeleteJob={handleDeleteJob}
                            />
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
