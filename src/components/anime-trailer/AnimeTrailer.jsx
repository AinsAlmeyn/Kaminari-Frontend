import React, { useState } from 'react';
import { Button, Popup } from 'devextreme-react';
import '../anime-trailer/AnimeTrailer.css';

const AnimeTrailer = ({ data }) => {
    const [isTrailerPopupVisible, setTrailerPopupVisible] = useState(false);
    const { embed_url } = data.trailer;

    const toggleTrailerPopup = () => {
        setTrailerPopupVisible(!isTrailerPopupVisible);
    };

    return (
        <div className="video-container">
            <div className="video-responsive">
                <iframe
                    src={embed_url}
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
                    <iframe
                        src={embed_url + "?autoplay=1"}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen={false}
                        title="Anime Trailer"
                        width="100%"
                        height="100%"
                    />
                )}
            />
        </div>

    );
};

export default AnimeTrailer;
