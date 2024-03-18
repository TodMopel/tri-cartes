import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import config from './../data/config';

const CategoryNode = ({ categoryName, jobs, onDeleteJob }) => {
    return (
        <li className="category-node center-content">
            <div className="category-name">{categoryName}</div>
            <ul className="jobs-list">
                {jobs.map((job, index) => (
                    job.isActive && (
                        <JobNode key={index} job={job} onDelete={() => onDeleteJob(categoryName, job)} />)
                ))}
            </ul>
        </li>
    );
};

const JobNode = ({ job, onDelete }) => {
    const [selected, setSelected] = useState(false);

    const onSelect = () => {
        setSelected(!selected);
    };

    return (
        <li className="job-node row-content">
            <span onClick={onSelect} className={`job-text ${selected ? 'job-text-selected' : ''}`}>{job.text}</span>
            <span className="delete-button button-small" onClick={onDelete}>{config.result.deleteJobButton}</span>
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
                    jobs: category.jobs.map((j) => (j.text === job.text ? { ...j, isActive: false } : j)),
                };
            }
            return category;
        });

        setResultTable(updatedResultTable);
    };

    const activeCategories = resultTable.filter((category) => category.jobs.some((job) => job.isActive));

    return (
        <div className="background-grid result-page center-content">
            <div className="center-content-spread">
                <div>
                    <h1>{config.result.title}</h1>
                    <h3>{config.result.subTitle}</h3>
                </div>
                <ul className="result-list">
                    {activeCategories &&
                        activeCategories.map((category, index) => (
                            <CategoryNode
                                key={index}
                                categoryName={category.categoryName}
                                jobs={category.jobs}
                                onDeleteJob={handleDeleteJob}
                            />
                        ))}
                </ul>
                <div className="ui-card ui-button-container">
                    <Link to="/" className="button button-normal">
                        Retourner à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
