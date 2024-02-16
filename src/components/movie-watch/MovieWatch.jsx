import React, { useState } from 'react';
import { Button, Popup } from 'devextreme-react';

const MovieWatch = ({ data: movieId }) => {
    const [isMoviePopupVisible, setMoviePopupVisible] = useState(false);
    const [isMovieWithSubPopupVisible, setMovieWithSubPopupVisible] = useState(false);

    const videoUrl = `https://vidsrc.to/embed/movie/${movieId}`;
    const videoUrlWithSub = `https://vidsrc.xyz/embed/movie?tmdb=${movieId}&ds_langs=en,tr`;

    const toggleMoviePopup = () => {
        setMoviePopupVisible(!isMoviePopupVisible);
    };

    const toggleMovieWithSubPopup = () => {
        setMovieWithSubPopupVisible(!isMovieWithSubPopupVisible);
    };

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="video-container">
            <div className={"content-block dx-card responsive-paddings"} style={{ height: "100%", width: "100%" }}>
                <h2>Watch From Kaminari</h2>
                <div className="row" style={{ textAlign: 'center', marginTop: '10px' }}>
                    <div className="col-6">
                        <Button
                            text="Watch Movie"
                            onClick={toggleMoviePopup}
                            type="success"
                            stylingMode="contained"
                            width="100%"
                            style={{
                                backgroundColor: '#009688',
                                color: 'white',
                            }}
                        />
                    </div>
                    <div className="col-6">
                        <Button
                            text="Watch Movie With Sub"
                            onClick={toggleMovieWithSubPopup}
                            type="success"
                            stylingMode="contained"
                            width="100%"
                            style={{
                                backgroundColor: '#009688',
                                color: 'white',
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={"content-block dx-card responsive-paddings"} style={{ height: "100%", width: "100%" }}>
                <h2>Watch From Browser</h2>
                <div className="row" style={{ textAlign: 'center', marginTop: '10px' }}>
                    <div className="col-6">
                        <Button
                            text="Watch Movie"
                            onClick={() => openInNewTab(videoUrl)}
                            type="success"
                            stylingMode="contained"
                            width="100%"
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                            }}
                        />
                    </div>
                    <div className="col-6">
                        <Button
                            text="Watch Movie With Sub"
                            onClick={() => openInNewTab(videoUrlWithSub)}
                            type="success"
                            stylingMode="contained"
                            width="100%"
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                            }}
                        />
                    </div>
                </div>
            </div>
            <Popup
                visible={isMoviePopupVisible}
                onHiding={toggleMoviePopup}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title="Watch Movie"
                width="95%"
                height="95%"
                contentRender={() => (
                    <iframe
                        src={videoUrl + "?autoplay=1"}
                        allow="autoplay; encrypted-media"
                        allowFullScreen={true}
                        title="Movie Watch"
                        width="100%"
                        height="100%"
                        referrerPolicy="origin"
                    />
                )}
            />
            <Popup
                visible={isMovieWithSubPopupVisible}
                onHiding={toggleMovieWithSubPopup}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title="Watch Movie With Sub"
                width="95%"
                height="95%"
                contentRender={() => (
                    <iframe
                        src={videoUrlWithSub + "&autoplay=1"}
                        allow="autoplay; encrypted-media"
                        allowFullScreen={true}
                        title="Movie Watch With Sub"
                        width="100%"
                        height="100%"
                        referrerPolicy="origin"
                    />
                )}
            />
        </div>
    );
};

export default MovieWatch;

// import React, { useState } from 'react';
// import { Button, Popup } from 'devextreme-react';

// const MovieWatch = ({ data: movieId }) => {
//     const [isMoviePopupVisible, setMoviePopupVisible] = useState(false);
//     const [isMovieWithSubPopupVisible, setMovieWithSubPopupVisible] = useState(false);

//     const videoUrl = `https://vidsrc.to/embed/movie/${movieId}`;
//     const videoUrlWithSub = `https://vidsrc.xyz/embed/movie?tmdb=${movieId}&ds_langs=en,tr`;

//     const toggleMoviePopup = () => {
//         setMoviePopupVisible(!isMoviePopupVisible);
//     };

//     const toggleMovieWithSubPopup = () => {
//         setMovieWithSubPopupVisible(!isMovieWithSubPopupVisible);
//     };

//     const openInNewTab = (url) => {
//         window.open(url, '_blank', 'noopener,noreferrer');
//     };

//     return (
//         <div className="video-container">
//             <div className="row">
//                 {/* Movie Detail Card */}
//                 <div className="col-md-6" style={{ padding: '10px' }}>
//                     <div className={"content-block dx-card responsive-paddings"} style={{ height: "100%", width: "100%" }}>
//                         <h2>Watch From Kaminari</h2>
//                         <div className="row" style={{ textAlign: 'center', marginTop: '10px' }}>
//                             <div className="col-6">
//                                 <Button
//                                     text="Watch Movie"
//                                     onClick={toggleMoviePopup}
//                                     type="success"
//                                     stylingMode="contained"
//                                     width="100%"
//                                     style={{
//                                         backgroundColor: '#009688',
//                                         color: 'white',
//                                     }}
//                                 />
//                             </div>
//                             <div className="col-6">
//                                 <Button
//                                     text="Watch Movie With Sub"
//                                     onClick={toggleMovieWithSubPopup}
//                                     type="success"
//                                     stylingMode="contained"
//                                     width="100%"
//                                     style={{
//                                         backgroundColor: '#009688',
//                                         color: 'white',
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Watch From Browser Card */}
//                 <div className="col-md-6" style={{ padding: '10px' }}>
//                     <div className={"content-block dx-card responsive-paddings"} style={{ height: "100%", width: "100%" }}>
//                         <h2>Watch From Browser</h2>
//                         <div className="row" style={{ textAlign: 'center', marginTop: '10px' }}>
//                             <div className="col-6">
//                                 <Button
//                                     text="Watch Movie"
//                                     onClick={() => openInNewTab(videoUrl)}
//                                     type="success"
//                                     stylingMode="contained"
//                                     width="100%"
//                                     style={{
//                                         backgroundColor: '#007bff',
//                                         color: 'white',
//                                     }}
//                                 />
//                             </div>
//                             <div className="col-6">
//                                 <Button
//                                     text="Watch Movie With Sub"
//                                     onClick={() => openInNewTab(videoUrlWithSub)}
//                                     type="success"
//                                     stylingMode="contained"
//                                     width="100%"
//                                     style={{
//                                         backgroundColor: '#007bff',
//                                         color: 'white',
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Popup
//                 visible={isMoviePopupVisible}
//                 onHiding={toggleMoviePopup}
//                 hideOnOutsideClick={true}
//                 showCloseButton={true}
//                 showTitle={true}
//                 title="Watch Movie"
//                 width="95%"
//                 height="95%"
//                 contentRender={() => (
//                     <iframe
//                         src={videoUrl + "?autoplay=1"}
//                         allow="autoplay; encrypted-media"
//                         allowFullScreen={true}
//                         title="Movie Watch"
//                         width="100%"
//                         height="100%"
//                         referrerPolicy="origin"
//                         sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
//                     />
//                 )}
//             />
//             <Popup
//                 visible={isMovieWithSubPopupVisible}
//                 onHiding={toggleMovieWithSubPopup}
//                 hideOnOutsideClick={true}
//                 showCloseButton={true}
//                 showTitle={true}
//                 title="Watch Movie With Sub"
//                 width="95%"
//                 height="95%"
//                 contentRender={() => (
//                     <iframe
//                         src={videoUrlWithSub + "&autoplay=1"}
//                         allow="autoplay; encrypted-media"
//                         allowFullScreen={true}
//                         title="Movie Watch With Sub"
//                         width="100%"
//                         height="100%"
//                         referrerPolicy="origin"
//                         sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
//                     />
//                 )}
//             />
//         </div>
//     );
// };

// export default MovieWatch;
