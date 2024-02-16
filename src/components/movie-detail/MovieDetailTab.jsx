import React, { useState, useEffect } from 'react';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';
import './movieDetailTab.css'; // Stil dosyasının yolu

const MovieDetailTab = ({ data: movieId }) => {
    const postRequestSyncPromise = usePostRequestSyncPromise();
    const [details, setDetails] = useState(null);

    function fetchMovieDetails(movieId) {
        const detailFilter = {
            id: `${movieId}`,
            language: "tr-TR",
            append_to_response: "videos"
        };

        const baseRequest = {
            requestId: "unique_request_id",
            sender: "client_tab_movie_details",
            data: [detailFilter]
        };

        postRequestSyncPromise("Movie/MovieDetail", baseRequest)
            .then(data => {
                setDetails(data.data[0]);
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }

    useEffect(() => {
        if (movieId) {
            fetchMovieDetails(movieId);
        }
    }, [movieId]);

    const renderItems = (items) => {
        return items && items.length > 0
            ? items.map((item, index) => (
                <span key={index}>
                    {item.name || item.english_name}
                </span>
            )).reduce((prev, curr) => [prev, ', ', curr])
            : 'N/A';
    };

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-title">Movie Details</span>
            </div>
            <div className="detail-content">
                {details && (
                    <>
                        <div className="detail-section">
                            <div className="detail-label">Languages:</div>
                            <div className="detail-value">{renderItems(details.spoken_languages)}</div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Countries:</div>
                            <div className="detail-value">{renderItems(details.production_countries)}</div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Companies:</div>
                            <div className="detail-value">{renderItems(details.production_companies)}</div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Homepage:</div>
                            <div className="detail-value">
                                {details.homepage ?
                                    <a href={details.homepage} target="_blank" rel="noopener noreferrer" className="homepage-link">Link</a>
                                    : 'N/A'}
                            </div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Genres:</div>
                            <div className="detail-value">{renderItems(details.genres)}</div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Budget:</div>
                            <div className="detail-value">{details.budget ? `${details.budget} USD` : 'N/A'}</div>
                        </div>
                        <div className="detail-section">
                            <div className="detail-label">Revenue:</div>
                            <div className="detail-value">{details.revenue ? `${details.revenue} USD` : 'N/A'}</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MovieDetailTab;
