import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import { Button, TextBox, Popup } from 'devextreme-react';
import '../home/home.css';
import {
    Column,
    DataGrid
} from "devextreme-react/data-grid";
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import moment from 'moment';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

export default function Together() {

    //! YT POPUP
    const [isYoutubePopupVisible, setYoutubePopupVisible] = useState(false);
    const [searchYoutube, setSearchYoutube] = useState("");
    const [youtubeSearchResults, setYoutubeSearchResults] = useState([]);
    const [nextPageToken, setNextPageToken] = useState("");
    const [prevPageToken, setPrevPageToken] = useState("");

    const toggleYoutubePopup = () => {
        setYoutubePopupVisible(!isYoutubePopupVisible);
    };

    //! CURRENT TIME
    const [currentTime, setCurrentTime] = useState(moment());

    //! IS MOBILE
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        // Her saniye currentTime'i güncelleyen bir zamanlayıcı başlat
        const intervalId = setInterval(() => {
            setCurrentTime(moment());
        }, 60000);

        // Bileşen kaldırıldığında zamanlayıcıyı temizle
        return () => clearInterval(intervalId);
    }, []);

    //! GRID HEIGHT
    const [gridHeight, setGridHeight] = useState(window.innerHeight);

    //! GLOBAL FETCH
    const postRequestSyncPromise = usePostRequestSyncPromise();

    //! TOGETHER ROOMS STATE
    const [togetherRooms, setTogetherRooms] = useState([]);

    //! IFRAME PANEL STATE
    const [showIFramePanel, setShowIFramePanel] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");
    const [userInput, setUserInput] = useState("");
    const [isURLValid, setIsURLValid] = useState(true);

    //! IS MOBILE
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    //! TOGETHER ROOMS FETCH
    function GetAllRooms() {
        postRequestSyncPromise("Together/GetAllRooms",)
            .then(data => {
                setTogetherRooms(data.data);
            })
            .catch(error => {
                console.error();
            });
    }

    function closeIFramePanel() {
        postRequestSyncPromise("Together/LeaveRoom", { userName: localStorage.getItem("userCode"), roomConnectionString: localStorage.getItem("roomConnectionString") })
            .then(data => {
            })
            .catch(error => {
                console.error();
            });
        setShowIFramePanel(false);
    }

    //! CREATE ROOM
    function CreateRoom() {
        const createRoomRequest = {
            share: "https://www.youtube.com/watch?v=f_WuRfuMXQw&ab_channel=SheeshBruhSubscribeBro",
            bg_color: "#363640",
            bg_opacity: "50"
        };

        const baseRequest = {
            RequestId: "unique_request_id",
            Sender: "client_create_room_request",
            Data: [createRoomRequest]
        };

        postRequestSyncPromise("Together/CreateRoom", baseRequest)
            .then(data => {
                GetAllRooms();
            })
            .catch(error => {
                console.error();
            });
    }

    function UpdateRoom() {
        if (isURLValid) {
            const streamkey = iframeUrl.split('?r=')[1];
            const updateRoomRequest = {
                item_url: userInput,
                streamkey: streamkey
            };

            postRequestSyncPromise("Together/UpdateRoom", updateRoomRequest)
                .then(data => {
                })
                .catch(error => {
                    console.error();
                });
        } else {
            alert("Please enter a valid URL.");
        }
    }



    function enterRoom(roomConnectionString) {
        localStorage.setItem("roomConnectionString", roomConnectionString);
        postRequestSyncPromise("Together/EnterRoom", { userName: localStorage.getItem("userCode"), roomConnectionString: roomConnectionString })
            .then(data => {
            })
            .catch(error => {
                console.error();
            });
        setIframeUrl(roomConnectionString);
        setShowIFramePanel(true);
    }

    // function handleUserInputChange(e) {
    //     setUserInput(e.target.value);
    // }

    function handleUserInputChange(e) {
        const input = e.value;
        setUserInput(input);

        // Girilen metnin geçerli bir URL olup olmadığını kontrol et
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        setIsURLValid(!!input && urlPattern.test(input));
    }

    //! USE EFFECT
    useEffect(() => {
        const handleResize = () => {
            setGridHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        GetAllRooms();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //! SEARCH YOUTUBE ONCLICK
    function SearchYoutube() {
        const searchYoutubeRequest = {
            type: 'video',
            videoEmbeddable: true,
            pageToken: "",
            q: searchYoutube
        };

        postRequestSyncPromise("Together/YTSearchVideo", searchYoutubeRequest)
            .then(data => {
                if (data.type === 0) {
                    setYoutubeSearchResults(data.data[0].items);
                    setNextPageToken(data.data[0].nextPageInformation);
                    setPrevPageToken(data.data[0].prevPageToken);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    function VideoDetailsCellRender(cellInfo) {
        // Açıklamanın ilk 150 kelimesini al
        const trimmedDescription = cellInfo.data.snippet.description.split(/\s+/).slice(0, 150).join(" ") + '...';

        // Sayıları ondalık formatına çevir
        const formatNumber = (num) => {
            if (num === null || num === undefined) {
                num = 0;
            }
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        // Thumbnail URL'sini bul
        const thumbnailUrl = cellInfo.data.snippet.thumbnails.maxres?.url ||
            cellInfo.data.snippet.thumbnails.standard?.url ||
            cellInfo.data.snippet.thumbnails.high?.url ||
            cellInfo.data.snippet.thumbnails.medium?.url ||
            cellInfo.data.snippet.thumbnails.default?.url;

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                {thumbnailUrl ?
                    <img src={thumbnailUrl} alt="Thumbnail" style={{ maxWidth: '220px', maxHeight: '220px', marginBottom: '20px' }} /> :
                    <div style={{ maxWidth: '220px', maxHeight: '220px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Resim Yok</div>
                }
                <div>
                    <div style={{ fontWeight: '600', fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>{cellInfo.data.snippet.title}</div>
                    <div style={{ marginBottom: '15px', textAlign: 'center', fontSize: '14px', color: '#fdf0d5', lineHeight: '1.5em' }}>{trimmedDescription}</div>
                    <div style={{ fontSize: '14px', color: '#777', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="far fa-calendar-alt"></i> {new Date(cellInfo.data.snippet.publishedAt).toLocaleDateString()}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="fas fa-eye"></i> {formatNumber(cellInfo.data.statistics.viewCount)} Views
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="far fa-thumbs-up"></i> {formatNumber(cellInfo.data.statistics.likeCount)} Likes
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <i className="far fa-comments"></i> {formatNumber(cellInfo.data.statistics.commentCount)} Comments
                        </span>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${cellInfo.data.id}`)} style={{ marginTop: '10px', padding: '5px 10px', fontSize: '14px', cursor: 'pointer' }}>
                        Copy Video URL
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div>
            {showIFramePanel ? (
                <div>
                    {isMobile ? (<iframe
                        src={iframeUrl}
                        width="100%"
                        height={gridHeight - 180}
                        style={{
                            border: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }}
                        allowFullScreen={true}
                    ></iframe>) : (<iframe
                        src={iframeUrl}
                        width="100%"
                        height={gridHeight - 180}
                        style={{ border: 'none' }}
                        allowFullScreen={true}
                    ></iframe>)}

                    <div style={{ marginTop: '20px' }}>
                        <Row>
                            <Col xs="6">
                                <TextBox
                                    value={userInput}
                                    onValueChanged={handleUserInputChange}
                                    label='Enter the URL of the video you want to watch together'
                                    labelMode='floating'
                                />
                            </Col>
                            <Col xs="2">
                                <Button
                                    text="Update Room"
                                    stylingMode='contained'
                                    hoverStateEnabled={true}
                                    height={"90%"}
                                    width={"100%"}
                                    style={{
                                        backgroundColor: '#76c893',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: '18px',
                                        borderRadius: '5px',
                                    }}
                                    onClick={() => {
                                        UpdateRoom();
                                    }}
                                />
                            </Col>
                            <Col xs="2">
                                <Button
                                    text="Back to Rooms"
                                    stylingMode='contained'
                                    hoverStateEnabled={true}
                                    height={"90%"}
                                    width={"100%"}
                                    style={{
                                        backgroundColor: '#ff4d6d',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: '18px',
                                        borderRadius: '5px',
                                    }}
                                    onClick={closeIFramePanel}
                                />
                            </Col>
                            <Col xs="2">
                                <Button
                                    text="Youtube"
                                    stylingMode='contained'
                                    hoverStateEnabled={true}
                                    height={"90%"}
                                    width={"100%"}
                                    style={{
                                        backgroundColor: '#FF0000',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: '18px',
                                        borderRadius: '5px',
                                    }}
                                    onClick={toggleYoutubePopup}
                                />
                            </Col>
                        </Row>
                    </div>
                    <Popup
                        visible={isYoutubePopupVisible}
                        onHiding={toggleYoutubePopup}
                        hideOnOutsideClick={true}
                        showTitle={true}
                        title='Search Video on Youtube'
                        width={isMobile ? "50%" : "85%"}
                        height={isMobile ? "50%" : "85%"}
                        contentRender={() => {
                            return (
                                <div>
                                    <Row>
                                        <Col xs="9">
                                            <TextBox
                                                value={searchYoutube}
                                                onValueChanged={(e) => setSearchYoutube(e.value)}
                                                label='Search for a video on Youtube'
                                                labelMode='floating'
                                            />
                                        </Col>
                                        <Col xs="3">
                                            <Button
                                                text="Youtube"
                                                stylingMode='contained'
                                                hoverStateEnabled={true}
                                                height={"90%"}
                                                width={"100%"}
                                                style={{
                                                    backgroundColor: '#FF0000',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    fontSize: '18px',
                                                    borderRadius: '5px',
                                                }}
                                                onClick={SearchYoutube}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <DataGrid
                                            dataSource={youtubeSearchResults}
                                            keyExpr="id"
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            columnAutoWidth={true}
                                            wordWrapEnabled={true}
                                            hoverStateEnabled={true}
                                            cellHintEnabled={true}
                                            showBorders={true}
                                            height={900}
                                            scrolling={{
                                                mode: "virtual",
                                                showScrollbar: "always",
                                                columnRenderingMode: "standard"
                                            }}
                                            showColumnHeaders={false}
                                            showColumnLines={true}
                                            showRowLines={true}
                                        >
                                            <Column caption="Video Details" cellRender={VideoDetailsCellRender} width={700} />
                                        </DataGrid>
                                    </Row>
                                    <Row>
                                        <Col xs="6">
                                            <Button
                                                text="Previous Page"
                                                stylingMode='contained'
                                                disabled={prevPageToken === ""}
                                                hoverStateEnabled={true}
                                                height={"90%"}
                                                width={"100%"}
                                                style={{
                                                    backgroundColor: '#FF0000',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    fontSize: '18px',
                                                    borderRadius: '5px',
                                                }}
                                                onClick={() => {
                                                    const searchYoutubeRequest = {
                                                        type: 'video',
                                                        videoEmbeddable: true,
                                                        pageToken: prevPageToken,
                                                        q: searchYoutube
                                                    };

                                                    postRequestSyncPromise("Together/YTSearchVideo", searchYoutubeRequest)
                                                        .then(data => {
                                                            if (data.type === 0) {
                                                                setYoutubeSearchResults(data.data[0].items);
                                                                setNextPageToken(data.data[0].nextPageInformation);
                                                                setPrevPageToken(data.data[0].prevPageToken);
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error(error);
                                                        });
                                                }}
                                            />
                                        </Col>
                                        <Col xs="6">
                                            <Button
                                                text="Next Page"
                                                stylingMode='contained'
                                                disabled={nextPageToken === ""}
                                                hoverStateEnabled={true}
                                                style={{
                                                    backgroundColor: '#FF0000',
                                                    color: 'white',
                                                    padding: '10px 20px',
                                                    fontSize: '18px',
                                                    borderRadius: '5px',
                                                }}
                                                height={"90%"}
                                                width={"100%"}
                                                onClick={() => {
                                                    const searchYoutubeRequest = {
                                                        type: 'video',
                                                        videoEmbeddable: true,
                                                        pageToken: nextPageToken,
                                                        q: searchYoutube
                                                    };

                                                    postRequestSyncPromise("Together/YTSearchVideo", searchYoutubeRequest)
                                                        .then(data => {
                                                            if (data.type === 0) {
                                                                setYoutubeSearchResults(data.data[0].items);
                                                                setNextPageToken(data.data[0].nextPageInformation);
                                                                setPrevPageToken(data.data[0].prevPageToken);
                                                            }
                                                        })
                                                        .catch(error => {
                                                            console.error(error);
                                                        });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }}
                    />
                </div>
            ) : (
                <div>
                    <Row className="justify-content-md-center" style={{ marginTop: '20px' }}>
                        <Col md="auto">
                            <h3>Watch Together</h3>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center" style={{ marginTop: '20px', alignItems: 'center' }}>
                        <Col md="auto">
                            <Button
                                text="Create Room"
                                stylingMode='contained'
                                disabled={togetherRooms.length >= 3}
                                hoverStateEnabled={true}
                                style={{
                                    backgroundColor: '#FF5722',
                                    color: 'white',
                                    padding: '10px 20px',
                                    fontSize: '18px',
                                    borderRadius: '5px',
                                    marginRight: '10px', // added some margin for spacing
                                }}
                                onClick={() => {
                                    CreateRoom();
                                }}
                            />
                        </Col>

                        <Col md="auto" style={{ display: 'flex', alignItems: 'center' }}>
                            <hr style={{ width: '1px', height: '30px', backgroundColor: '#000', margin: '0 20px' }} />
                            <span>OR</span>
                            <hr style={{ width: '1px', height: '30px', backgroundColor: '#000', margin: '0 20px' }} />
                        </Col>

                        <Col md="auto">
                            <TextBox
                                label='Already Have Another Room'
                                labelMode='floating'
                                onValueChanged={handleUserInputChange} // reuse the existing handler or create a new one if needed
                                stylingMode='outlined'
                                style={{
                                    marginRight: '10px', // added some margin for spacing
                                }}
                            />
                        </Col>
                        <Col md="auto">
                            <Button
                                text="Enter Room"
                                stylingMode='contained'
                                hoverStateEnabled={true}
                                style={{
                                    backgroundColor: '#009688',
                                    color: 'white',
                                    padding: '10px 20px',
                                    fontSize: '18px',
                                    borderRadius: '5px',
                                }}
                                onClick={() => {
                                    if (isURLValid) {
                                        enterRoom(userInput);
                                    }
                                }}
                            />
                        </Col>
                    </Row>

                    <br />
                    <DataGrid
                        dataSource={togetherRooms}
                        keyExpr="_id"
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        wordWrapEnabled={true}
                        hoverStateEnabled={true}
                        cellHintEnabled={true}
                        showBorders={true}
                        height={360}
                        scrolling={{
                            mode: "virtual",
                            showScrollbar: "always",
                            columnRenderingMode: "standard"
                        }}
                        showColumnHeaders={true}
                        showColumnLines={true}
                        showRowLines={true}
                    >
                        <Column
                            dataField="createDate"
                            caption="Create Date"
                            cellRender={({ value }) => {
                                const date = moment(value);
                                const formattedDate = date.format("YYYY-MM-DD HH:mm:ss");
                                const expirationDate = date.clone().add(24, 'hours');
                                const duration = moment.duration(expirationDate.diff(currentTime));
                                const remainingTime = `${duration.hours()}h : ${duration.minutes()}m`;

                                return (
                                    <div>
                                        <div>{formattedDate}</div>
                                        <div>Remaining Time: {remainingTime}</div>
                                    </div>
                                );
                            }}
                        />
                        <Column
                            dataField="activeUsers"
                            caption="Active Users"
                            cellRender={({ value }) => {
                                const usersString = value?.join(', ') || 'No active users';
                                return (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span title={usersString} style={{ flexGrow: 1, marginRight: "10px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                            {usersString}
                                        </span>
                                        <Button
                                            onClick={() => GetAllRooms()}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                backgroundColor: "#009688",
                                                color: "white",
                                                padding: "5px 10px",
                                                fontSize: "14px",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                border: "none"
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faSync} style={{ marginRight: "5px" }} />
                                            Refresh
                                        </Button>
                                    </div>
                                );
                            }}
                        />

                        <Column
                            dataField="roomConnectionString"
                            caption="Enter The Room"
                            cellRender={({ data }) => (
                                <Button
                                    text="Enter Room"
                                    onClick={() => enterRoom(data.roomConnectionString)}
                                    style={{
                                        backgroundColor: '#FF5722',
                                        color: 'white',
                                        padding: '10px 20px',
                                        fontSize: '18px',
                                        borderRadius: '5px',
                                    }}
                                />
                            )}
                        />
                    </DataGrid>
                </div>
            )}
        </div>
    );
}