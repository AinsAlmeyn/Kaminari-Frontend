import React, { useState, useEffect } from 'react';
import { Button, Popup } from 'devextreme-react';
import _ from 'lodash';
import '../anime-trailer/AnimeTrailer.css';
import { usePostRequestSyncPromise } from '../../global/GlobalFetch';

const fetchTrailerDebounced = _.debounce((animeId, postRequestSyncPromise, setTrailerData, setIsLoading, setError) => {
    setIsLoading(true);
    postRequestSyncPromise("Anime/AnimeById", { series_animedb_id: animeId })
        .then(data => {
            setTrailerData(data.data.trailer.embed_url);
            setIsLoading(false);
        })
        .catch(error => {
            console.error("Fetch error:", error);
            setError(error);
            setIsLoading(false);
        });
}, 0);

const AnimeTrailerProfile = ({ data: animeId }) => {
    const [isTrailerPopupVisible, setTrailerPopupVisible] = useState(false);
    const [trailerData, setTrailerData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const postRequestSyncPromise = usePostRequestSyncPromise();

    useEffect(() => {
        if (animeId) {
            fetchTrailerDebounced(animeId, postRequestSyncPromise, setTrailerData, setIsLoading, setError);
        }
        return () => {
            fetchTrailerDebounced.cancel();
        };
    }, [animeId, postRequestSyncPromise]);

    const toggleTrailerPopup = () => {
        setTrailerPopupVisible(!isTrailerPopupVisible);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading trailer: {error.message}</p>;
    if (!trailerData) return <p>Trailer not available.</p>;

    return (
        <div className="video-container">
            <div className="video-responsive">
                {/* Her zaman gösterilen ufak iframe */}
                <iframe
                    src={trailerData}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    title="Anime Trailer"
                />
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                    text="Watch Fullscreen Trailer"
                    onClick={toggleTrailerPopup}
                    style={{
                        backgroundColor: '#009688',
                        color: 'white',
                        maxWidth: '95%',
                    }}
                />
            </div>
            <Popup
                visible={isTrailerPopupVisible}
                onHiding={toggleTrailerPopup}
                closeOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title="Anime Trailer"
                width="95%"
                height="95%"
                contentRender={() => (
                    // Tam ekran için ayrı bir iframe, bu iframe yalnızca Popup açıkken gösterilecek
                    <iframe
                        src={trailerData + "?autoplay=1"}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen={true}
                        title="Anime Trailer Fullscreen"
                        width="100%"
                        height="100%"
                    />
                )}
            />
        </div>
    );
};

export default AnimeTrailerProfile;
