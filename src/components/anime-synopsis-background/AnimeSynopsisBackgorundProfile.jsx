import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import '../anime-synopsis-background/animeSynopsisBackground.css';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';

// Assuming that the synopsis and background data can be fetched using the anime ID
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
}, ); // Adjust the debounce time as needed

const AnimeSynopsisBackgorundProfile = ({ data : animeId }) => {
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

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!details) return <p>Details not found.</p>;

    const { synopsis, background } = details;

    return (
        <div className="detail-container">
            <div className="detail-header">
                <span className="detail-title">Anime Synopsis & Background</span>
            </div>
            <div className="detail-content">
                <div className="detail-section">
                    <div className="detail-label">Synopsis:</div>
                    <div className="detail-value detail-synopsis">{synopsis}</div>
                </div>
                {background && (
                    <div className="detail-section">
                        <div className="detail-label">Background:</div>
                        <div className="detail-value detail-background">{background}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AnimeSynopsisBackgorundProfile;
