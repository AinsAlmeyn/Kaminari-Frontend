import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import '../anime-detail/animeDetailTab.css';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';
const fetchDetailsDebounced = _.debounce((animeId, postRequestSyncPromise, setDetails, setIsLoading, setError) => {
    setIsLoading(true);
    postRequestSyncPromise("Anime/AnimeById", { series_animedb_id: animeId })
        .then(data => {
            setDetails(data.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setError(error);
            setIsLoading(false);
        });
},);
const AnimeDetailProfileTab = ({ data: animeId }) => {
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        if (animeId) {
            fetchDetailsDebounced(animeId, postRequestSyncPromise, setDetails, setIsLoading, setError);
        }
        return () => {
            fetchDetailsDebounced.cancel();
        }
    }, [animeId, postRequestSyncPromise]);

    if (!details) return <p>Details not found.</p>;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const { producers, studios, genres, licensors, broadcast, duration, rating, status, source } = details;

    const renderLinks = (items, className) => {
        return items.length > 0
            ? items.map(item => (
                <a key={item.mal_id} href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
                    {item.name}
                </a>
            )).reduce((prev, curr) => [prev, ', ', curr])
            : 'N/A';
    };

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-title">Anime Details</span>
            </div>
            <div className="detail-content">
                <div className="detail-section">
                    <div className="detail-label">Producers:</div>
                    <div className="detail-value">{renderLinks(producers, 'producer-link')}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Studios:</div>
                    <div className="detail-value">{renderLinks(studios, 'studio-link')}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Genres:</div>
                    <div className="detail-value">{renderLinks(genres, 'genre-link')}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Licensors:</div>
                    <div className="detail-value">{licensors.length > 0 ? licensors.map(l => l.name).join(', ') : 'N/A'}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Source:</div>
                    <div className="detail-value">{source}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Broadcast:</div>
                    <div className="detail-value">{broadcast.day} at {broadcast.time} ({broadcast.timezone})</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Duration:</div>
                    <div className="detail-value">{duration}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Rating:</div>
                    <div className="detail-value">{rating}</div>
                </div>
                <div className="detail-section">
                    <div className="detail-label">Status:</div>
                    <div className="detail-value">{status}</div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetailProfileTab;






