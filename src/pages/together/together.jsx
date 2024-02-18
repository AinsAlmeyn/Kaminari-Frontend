import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import { Button, TextBox } from 'devextreme-react';
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
                console.log(data.data);
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
                            <Col xs="3">
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
                            <Col xs="3">
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
                        </Row>
                    </div>
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